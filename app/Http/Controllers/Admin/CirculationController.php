<?php

namespace App\Http\Controllers\Admin;

use App\Exports\CirculationExport;
use App\Http\Controllers\Controller;
use App\Models\Circulation;
use App\Models\CirculationRule;
use App\Models\ItemPhysicalCopy;
use App\Models\Library;
use App\Models\User;
use App\Models\UserCategory;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class CirculationController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // new Middleware('permission:circulation view', only: ['index', 'show']),
            // new Middleware('permission:circulation create', only: ['create', 'store']),
            // new Middleware('permission:circulation update', only: ['edit', 'update', 'recover', 'update_fine_status']),
            // new Middleware('permission:circulation delete', only: ['destroy', 'destroy_image']),
        ];
    }
    /**
     * Display a listing of the resource.
     */

    public function checkout_desk(Request $request)
    {
        $search = $request->input('search', '');
        $users_searched = [];

        // Only hit the database if the user actually typed something
        if (!empty($search)) {
            $users_searched = User::query()
                ->where(function ($sub_query) use ($search) {
                    $sub_query->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('name_kh', 'LIKE', "%{$search}%")
                        ->orWhere('card_number', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%");
                })
                ->where('library_id', $request->user()->library_id)
                ->orderBy('card_number')
                ->orderBy('name')
                ->limit(10)
                ->get();
        }
        // return $users_searched;

        return Inertia::render('Admin/Circulation/Checkout', [
            'users_searched' => $users_searched,
        ]);
    }
    public function checkin_desk(Request $request)
    {
        $search = $request->input('search', '');
        $users_searched = [];

        // Only hit the database if the user actually typed something
        if (!empty($search)) {
            $users_searched = User::query()
                ->where(function ($sub_query) use ($search) {
                    $sub_query->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('name_kh', 'LIKE', "%{$search}%")
                        ->orWhere('card_number', 'LIKE', "%{$search}%")
                        ->orWhere('id', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%");
                })
                // Move sorting inside the search block for better performance
                ->orderBy('card_number')
                ->orderBy('name')
                ->limit(10)
                ->get();
        }

        // return $users_searched;

        return Inertia::render('Admin/Circulation/Checkin', [
            'users_searched' => $users_searched,
        ]);
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'borrower_id' => [
                'required',
                Rule::exists('users', 'id')
                    ->where(
                        fn($query) =>
                        $query->where('library_id', $request->user()->library_id)
                    ),
            ],
            'item_physical_copy_barcode' => [
                'required',
                'string',
                Rule::exists('item_physical_copies', 'barcode')
                    ->where(
                        fn($query) =>
                        $query->where('library_id', $request->user()->library_id)
                    ),
            ],
        ]);

        $physical_copy = ItemPhysicalCopy::where('library_id', $request->user()->library_id)->where('barcode', $request->item_physical_copy_barcode)->with('item_type')->first();

        if (!$physical_copy) {
            return redirect()->back()->withErrors(["Barcode not found."]);
        }

        if (!$physical_copy->item_type->is_checkable) {
            return redirect()->back()->withErrors(["This item type is not allowed checkout."]);
        }

        if ($physical_copy->not_for_loan || $physical_copy->item_lost || $physical_copy->withdrawn) {
            return redirect()->back()->withErrors('Failed to Checkout: Item is not for loan.');
        }

        // Check if already on loan
        $active_loan = Circulation::where('library_id', $request->user()->library_id)->where('item_physical_copy_id', $physical_copy->id)
            ->whereNull('returned_at')
            ->first();

        if ($active_loan) {
            return redirect()->back()->withErrors('Failed to Checkout: Item is already on loan.');
        }

        $borrower = User::findOrFail($request->borrower_id);
        if ($borrower->expired_at && now()->isAfter($borrower->expired_at)) {
            return redirect()->back()->withErrors(
                "User Account Expired."
            );
        }

        $category = UserCategory::where('library_id', $request->user()->library_id)->where('code', $borrower->category_code)->first();
        $defaultRule = CirculationRule::where('library_id', $request->user()->library_id)->first();
        $borrowingLimit = $category->borrowing_limit ?? $defaultRule->borrowing_limit ?? 2;

        if ($borrower->total_active_loan >= $borrowingLimit) {
            return redirect()->back()->withErrors([
                'item_physical_copy_barcode' => "Limit reached: This user can only borrow {$borrowingLimit} items."
            ]);
        }

        try {
            DB::transaction(function () use ($request, $physical_copy, $borrower, $category, $defaultRule) {
                // 2. Determine Loan Period
                $loanDays = $category->loan_period ?? $defaultRule->loan_period ?? 14;

                $now = now();
                $dueAt = $now->copy()->addDays($loanDays);

                // 3. Create Circulation Record
                Circulation::create([
                    'item_physical_copy_id' => $physical_copy->id,
                    'library_id'            => $request->user()->library_id,
                    'borrower_id'           => $borrower->id,
                    'borrowed_at'           => $now,
                    'due_at'                => $dueAt,
                    'created_by'            => $request->user()->id,
                    'updated_by'            => $request->user()->id,
                ]);

                // 4. Update Physical Copy Status
                $physical_copy->update([
                    'borrowed_at'      => $now,
                    'due_at'           => $dueAt,
                    'last_borrowed_at' => $now,
                    'total_checkouts'  => $physical_copy->total_checkouts + 1,
                    'updated_by'       => $request->user()->id,
                ]);

                $item = $physical_copy->item;
                $item->update([
                    'total_checkouts'  => $item->total_checkouts + 1,
                ]);
                // 5. Increment User Counter
                $borrower->increment('total_active_loan');
                $borrower->increment('total_checkouts');
            });

            return redirect()->back()->with('success', 'Item checked out successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors("Transaction failed: " . $e->getMessage());
        }
    }
    public function checkin(Request $request)
    {
        $request->validate([
            'item_physical_copy_barcode' => [
                'required',
                'string',
                Rule::exists('item_physical_copies', 'barcode')
                    ->where(
                        fn($query) =>
                        $query->where('library_id', $request->user()->library_id)
                    ),
            ],
        ]);

        $physical_copy = ItemPhysicalCopy::where('library_id', $request->user()->library_id)->where('barcode', $request->item_physical_copy_barcode)->first();

        if (!$physical_copy) {
            return redirect()->back()->withErrors(["Barcode not found."]);
        }
        // Find the active circulation record
        $active_loan = Circulation::where('library_id', $request->user()->library_id)->where('item_physical_copy_id', $physical_copy->id)
            ->whereNull('returned_at')
            ->first();

        if (!$active_loan) {
            return redirect()->back()->withErrors('Failed to Check-in: Item is not currently on loan.');
        }

        try {
            DB::transaction(function () use ($request, $physical_copy, $active_loan) {
                // 1. Get Borrower Category and Default Rules
                $category = UserCategory::where('code', $active_loan->borrower->category_code)->first();
                $defaultRule = CirculationRule::first();

                // 2. Determine Rates (Category first, then Default)
                $finePerDay = $category->fine_amount_per_day ?? $defaultRule->fine_amount_per_day ?? 0;
                $maxFine = $category->max_fines_amount ?? $defaultRule->max_fines_amount ?? 0;

                $fine = 0;
                $now = now();

                // 3. Calculate Fine
                if ($active_loan->due_at && $now->gt($active_loan->due_at)) {
                    $days_late = (int) $now->diffInDays($active_loan->due_at, true);

                    $calculatedFine = $days_late * $finePerDay;

                    // Ensure fine doesn't exceed the maximum allowed
                    $fine = min($calculatedFine, $maxFine);
                }

                // 1. Close the Circulation Record
                $active_loan->update([
                    'returned_at' => now(),
                    'fine_amount' => $fine,
                    'fine_paid'   => false,
                    'updated_by'  => $request->user()->id,
                ]);

                // 2. Reset Physical Copy Status
                $physical_copy->update([
                    'borrowed_at'  => null,
                    'due_at'       => null,
                    'last_seen_at' => now(),
                    'updated_by'   => $request->user()->id,
                ]);
                if ($active_loan->borrower->total_active_loan > 0) {
                    $active_loan->borrower->decrement('total_active_loan');
                }
            });

            return redirect()->back()->with('success', 'Check-in successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to Check-in: ' . $e->getMessage());
        }
    }

    public function get_recent_checkouts()
    {
        $data = Circulation::with(['item_physical_copy.item', 'borrower'])
            ->orderByDesc('id')
            ->limit(20)
            ->whereNull('returned_at')
            ->where('library_id', Auth::user()->library_id)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'barcode' => $c->item_physical_copy->barcode ?? 'N/A',
                'item_id' => $c->item_physical_copy->item->id ?? '',
                'title' => $c->item_physical_copy->item->name ?? 'Untitled',
                'borrower_id' => $c->borrower->id ?? 'Unknown',
                'borrower_name' => $c->borrower->name ?? 'Unknown',
                'borrower_card_number' => $c->borrower->card_number ?? 'Unknown',
                'due_at' => $c->due_at,
                'returned_at' => $c->returned_at,
                'borrowed_at' => $c->borrowed_at,
            ]);

        return response()->json($data);
    }
    public function get_recent_checkins()
    {
        $data = Circulation::with(['item_physical_copy.item', 'borrower'])
            ->orderByDesc('returned_at')
            ->limit(20)
            ->whereNotNull('returned_at')
            ->where('library_id', Auth::user()->library_id)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'barcode' => $c->item_physical_copy->barcode ?? 'N/A',
                'title' => $c->item_physical_copy->item->name ?? 'Untitled',
                'item_id' => $c->item_physical_copy->item->id ?? '',
                'borrower_id' => $c->borrower->id ?? 'Unknown',
                'borrower_name' => $c->borrower->name ?? 'Unknown',
                'borrower_card_number' => $c->borrower->card_number ?? 'Unknown',
                'due_at' => $c->due_at,
                'returned_at' => $c->returned_at,
                'borrowed_at' => $c->borrowed_at,
                'fine_amount' => $c->fine_amount ?? 0,
                'fine_paid' => $c->fine_paid ?? 0,
            ]);

        return response()->json($data);
    }


    public function all_circulations(Request $request, $library_code = null)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $library_id = $request->input('library_id', '');

        $trashed = $request->input('trashed');
        $filter_by = $request->input('filter_by');

        $user = $request->user();
        $isLibraryStaff = false;
        $hasGlobalPermission = $user->hasAnyPermission(['item view']);
        if ($library_code) {
            $currentUsedLibrary = Library::where('code', $library_code)->firstOrFail();
            $isLibraryStaff = ($user->library_id === $currentUsedLibrary->id) &&
                in_array($user->library_role, ['Owner', 'Staff']);
        }
         if ($isLibraryStaff) {
            $library_id = $currentUsedLibrary?->id;
        } else if ($hasGlobalPermission) {
            // ...
        } else {
            abort(403, 'You do not have permission to view this.');
        }

        $query = Circulation::query()
            ->with([
                'library',
                'borrower:id,name,card_number,image',
                'item_physical_copy.item:id,name,name_kh', // Assuming item_physical_copy belongsTo item
                'created_user:id,name',
                'updated_user:id,name'
            ]);

        if ($library_id) {
            $query->where('library_id', $library_id);
        }
        // Filter by filter_by (Custom Logic)
        if ($filter_by === 'on_loan') {
            $query->whereNull('returned_at');
        } elseif ($filter_by === 'returned') {
            $query->whereNotNull('returned_at');
        } elseif ($filter_by === 'overdue') {
            // Not returned AND past the due date
            $query->whereNull('returned_at')
                ->where('due_at', '<', now());
        } elseif ($filter_by === 'fine_unpaid') {
            // Has a fine amount AND fine_paid is false
            $query->where('fine_amount', '>', 0)
                ->where('fine_paid', false);
        } elseif ($filter_by === 'fine_paid') {
            // Only records where a fine was successfully collected
            $query->where('fine_amount', '>', 0)
                ->where('fine_paid', true);
        }

        // Search Logic (Searching Borrower Name, Card Number, or Barcode)
        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('id', 'LIKE', "%{$search}%")
                    ->orWhereHas('borrower', function ($q) use ($search) {
                        $q->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('card_number', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('item_physical_copy', function ($q) use ($search) {
                        $q->where('barcode', 'LIKE', "%{$search}%");
                    });
            });
        }

        // Soft Deletes
        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        // Ordering
        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate($perPage)->appends($request->all());

        // return $tableData;
        return Inertia::render('Admin/Circulation/Index', [
            'tableData' => $tableData,
            'filters' => $request->only(['search', 'status', 'sortBy', 'sortDirection']),
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }


    public function recover($id)
    {
        $circulation_rule = Circulation::withTrashed()->findOrFail($id); // 👈 include soft-deleted Circulation Rule
        $circulation_rule->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Circulation recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function update_fine_status(Request $request, Circulation $circulation)
    {
        // Validate that the status is being passed
        $request->validate([
            'status' => 'required|boolean'
        ]);

        $circulation->update([
            'fine_paid' => $request->status,
            'updated_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Fine Status updated successfully.');
    }
    public function destroy(Circulation $circulation)
    {
        $circulation->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Circulation deleted successfully.');
    }

    // EXPORTS
    public function export_circulations(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $trashed = $request->input('trashed');
        $filter_by = $request->input('filter_by');

        $query = Circulation::query()
            ->with([
                'borrower:id,name,card_number,image',
                'item_physical_copy.item:id,name,name_kh',
                'created_user:id,name',
                'updated_user:id,name'
            ]);

        // SAME FILTERS
        if ($filter_by === 'on_loan') {
            $query->whereNull('returned_at');
        } elseif ($filter_by === 'returned') {
            $query->whereNotNull('returned_at');
        } elseif ($filter_by === 'overdue') {
            $query->whereNull('returned_at')->where('due_at', '<', now());
        } elseif ($filter_by === 'fine_unpaid') {
            $query->where('fine_amount', '>', 0)->where('fine_paid', false);
        } elseif ($filter_by === 'fine_paid') {
            $query->where('fine_amount', '>', 0)->where('fine_paid', true);
        }

        // SEARCH
        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('id', 'LIKE', "%{$search}%")
                    ->orWhereHas('borrower', function ($q) use ($search) {
                        $q->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('card_number', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('item_physical_copy', function ($q) use ($search) {
                        $q->where('barcode', 'LIKE', "%{$search}%");
                    });
            });
        }

        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        $rows = $query->orderBy($sortBy, $sortDirection)->get();

        return Excel::download(new CirculationExport($rows), 'circulations.xlsx');
    }
}
