<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ItemPhysicalCopyExport;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemPhysicalCopy;
use App\Models\ItemType;
use App\Models\Library;
use App\Models\Location;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ItemPhysicalCopyController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // new Middleware('permission:item view', only: ['index', 'show']),
            // new Middleware('permission:item create', only: ['create', 'store']),
            // new Middleware('permission:item update', only: ['edit', 'update', 'recover']),
            // new Middleware('permission:item delete', only: ['destroy', 'destroy_image']),
        ];
    }

    public function index(Request $request, $library_code = null)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');

        // Physical Item Filters
        $shelf_location_code = $request->input('shelf_location_code');
        $current_library_code = $request->input('current_library_code');
        $home_library_code = $request->input('home_library_code');
        $item_type_code = $request->input('item_type_code');
        $item_lost = $request->input('item_lost'); // '1' or '0'
        $not_for_loan = $request->input('not_for_loan'); // '1' or '0'
        $damaged = $request->input('damaged');    // '1' or '0'
        $withdrawn = $request->input('withdrawn'); // '1' or '0'
        $trashed = $request->input('trashed');     // '', 'with', 'only'

        $library_id = $request->input('library_id', '');

        $query = ItemPhysicalCopy::query();

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

        if ($library_id) {
            $query->where('library_id', $library_id);
        }

        // 1. Library & Type Filters
        if ($shelf_location_code) {
            $query->where('shelf_location_code', $shelf_location_code);
        }
        if ($current_library_code) {
            $query->where('current_library_code', $current_library_code);
        }
        if ($home_library_code) {
            $query->where('home_library_code', $home_library_code);
        }
        if ($item_type_code) {
            $query->where('item_type_code', $item_type_code);
        }

        // 2. Boolean Status Filters (Lost, Damaged, Withdrawn)
        // We check for !== null because '0' is a valid filter value
        if ($item_lost !== null && $item_lost !== '') {
            $query->where('item_lost', $item_lost);
        }
        if ($not_for_loan !== null && $not_for_loan !== '') {
            $query->where('not_for_loan', $not_for_loan);
        }
        if ($damaged !== null && $damaged !== '') {
            $query->where('damaged', $damaged);
        }
        if ($withdrawn !== null && $withdrawn !== '') {
            $query->where('withdrawn', $withdrawn);
        }

        // 3. Filter by trashed (soft deletes)
        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        // 4. Global Search (Barcode or Item ID)
        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('barcode', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%");
            });
        }

        // 5. Sorting and Eager Loading
        $query->orderBy($sortBy, $sortDirection)
            ->with(['created_user', 'updated_user', 'item', 'item_type', 'shelf_location', 'library']);

        $tableData = $query->paginate($perPage)->withQueryString()->onEachSide(2);

        return Inertia::render('Admin/ItemPhysicalCopy/Index', [
            'tableData' => $tableData,
            // Data for FilterSheet dropdowns
            'shelfLocations' => Location::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->where('type_code', 'shelf-location')->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'libraries' => Library::orderBy('order_index')->get(),
            'itemTypes' => ItemType::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('order_index')->get(),
        ]);
    }

    public function create(string $item_id, Request $request)
    {
        $item = Item::findOrFail($item_id);
        return Inertia::render('Admin/ItemPhysicalCopy/Create', [
            'itemRecord' => $item,
            'itemTypes' => ItemType::orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'shelfLocations' => Location::where('library_id', $item->library_id)->where('type_code', 'shelf-location')->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'libraries' => Library::orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $item = Item::find($request->item_id);

        $validated = $request->validate([
            'item_id'               => 'required|exists:items,id',
            'barcode' => [
                'required',
                'string',
                Rule::unique('item_physical_copies')
                    ->where(fn($query) => $query->where('library_id', $item->library_id))
            ],
            'full_call_number'      => 'nullable|string|max:255',
            'inventory_number'      => 'nullable|string|max:255',

            'public_note'           => 'nullable|string',
            'unpublic_note'         => 'nullable|string',

            // Validating against the 'code' column in related tables
            'shelf_location_code'   => 'nullable|string|exists:locations,code',
            'item_type_code'        => 'nullable|string|exists:item_types,code',
            'home_library_code'     => 'nullable|string|exists:libraries,code',
            'current_library_code'  => 'nullable|string|exists:libraries,code',

            // Koha Flags
            'not_for_loan'          => 'integer|min:0|max:9',
            'item_lost'             => 'integer|min:0|max:9',
            'withdrawn'             => 'integer|min:0|max:1',
            'damaged'               => 'integer|min:0|max:1',
        ]);

        try {
            $validated['library_id'] = $item->library_id;


            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;
            $validated['last_seen_at'] = now();

            ItemPhysicalCopy::create($validated);

            return redirect()->back()->with('success', 'Physical copy created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to create: ' . $e->getMessage()]);
        }
    }


    public function edit(string $item_id, string $physical_copy_id, Request $request)
    {
        $item = Item::findOrFail($item_id);
        $editData = ItemPhysicalCopy::findOrFail($physical_copy_id);
        return Inertia::render('Admin/ItemPhysicalCopy/Create', [
            'editData' => $editData,
            'itemRecord' => $item,
            'itemTypes' => ItemType::orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'shelfLocations' => Location::where('library_id', $item->library_id)->where('type_code', 'shelf-location')->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'libraries' => Library::orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }
    public function show(string $item_id, string $physical_copy_id, Request $request)
    {
        $item = Item::findOrFail($item_id);
        $editData = ItemPhysicalCopy::findOrFail($physical_copy_id);
        return Inertia::render('Admin/ItemPhysicalCopy/Create', [
            'editData' => $editData,
            'readOnly' => true,
            'itemRecord' => $item,
            'itemTypes' => ItemType::orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'shelfLocations' => Location::where('type_code', 'shelf-location')->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'libraries' => Library::orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(string $item_id, string $physical_copy_id, Request $request)
    {
        $editData = ItemPhysicalCopy::findOrFail($physical_copy_id);

        $validated = $request->validate([
            'item_id'               => 'required|exists:items,id',
            // BUG FIX: Ignore current ID in unique check
            'barcode' => [
                'required',
                'string',
                Rule::unique('item_physical_copies')
                    ->where(fn($query) => $query->where('library_id', $editData->library_id))
                    ->ignore($physical_copy_id)
            ],
            'full_call_number'      => 'nullable|string|max:255',
            'inventory_number'      => 'nullable|string|max:255',

            'public_note'           => 'nullable|string',
            'unpublic_note'         => 'nullable|string',

            'shelf_location_code'   => 'nullable|string|exists:locations,code',
            'item_type_code'        => 'nullable|string|exists:item_types,code',
            'home_library_code'     => 'nullable|string|exists:libraries,code',
            'current_library_code'  => 'nullable|string|exists:libraries,code',

            'not_for_loan'          => 'integer|min:0|max:9',
            'item_lost'             => 'integer|min:0|max:9',
            'withdrawn'             => 'integer|min:0|max:1',
            'damaged'               => 'integer|min:0|max:1',
        ]);

        try {
            $item = Item::find($validated['item_id']);
            $validated['library_id'] = $item->library_id;

            // Track updater
            $validated['updated_by'] = $request->user()->id;

            $editData->update($validated);

            return redirect()->back()->with('success', 'Physical copy updated successfully!');
        } catch (\Exception $e) {
            // Correcting error redirection format
            return redirect()->back()->withErrors(['error' => 'Failed to update: ' . $e->getMessage()]);
        }
    }
    public function recover(string $physical_copy_id, Request $request)
    {
        $editData = ItemPhysicalCopy::withTrashed()->findOrFail($physical_copy_id);

        try {

            $editData->restore();
            $editData->update([
                'updated_by' => $request->user()->id,
            ]);

            return redirect()->back()->with('success', 'Recover successfully!');
        } catch (\Exception $e) {
            // Correcting error redirection format
            return redirect()->back()->withErrors(['error' => 'Failed to Recover: ' . $e->getMessage()]);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $item_id, string $physical_copy_barcode, Request $request)
    {
        $item = Item::findOrFail($item_id);
        $item_physical_copy = ItemPhysicalCopy::where('barcode', $physical_copy_barcode)->firstOrFail();
        $item_physical_copy->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Physical copy deleted successfully.');
    }

    // EXPORT
    public function export_item_physical_copies(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');

        $shelf_location_code = $request->input('shelf_location_code');
        $current_library_code = $request->input('current_library_code');
        $home_library_code = $request->input('home_library_code');
        $item_type_code = $request->input('item_type_code');
        $item_lost = $request->input('item_lost');
        $not_for_loan = $request->input('not_for_loan');
        $damaged = $request->input('damaged');
        $withdrawn = $request->input('withdrawn');
        $trashed = $request->input('trashed');

        $query = ItemPhysicalCopy::query();

        // SAME FILTERS AS INDEX
        if ($shelf_location_code) {
            $query->where('shelf_location_code', $shelf_location_code);
        }
        if ($current_library_code) {
            $query->where('current_library_code', $current_library_code);
        }
        if ($home_library_code) {
            $query->where('home_library_code', $home_library_code);
        }
        if ($item_type_code) {
            $query->where('item_type_code', $item_type_code);
        }

        if ($item_lost !== null && $item_lost !== '') {
            $query->where('item_lost', $item_lost);
        }
        if ($not_for_loan !== null && $not_for_loan !== '') {
            $query->where('not_for_loan', $not_for_loan);
        }
        if ($damaged !== null && $damaged !== '') {
            $query->where('damaged', $damaged);
        }
        if ($withdrawn !== null && $withdrawn !== '') {
            $query->where('withdrawn', $withdrawn);
        }

        // TRASH FILTER (you forgot this)
        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        // SEARCH
        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('barcode', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%");
            });
        }

        // SORT (also missing)
        $query->orderBy($sortBy, $sortDirection);

        // EAGER LOAD
        $query->with([
            'created_user',
            'updated_user',
            'item',
            'item_type',
            'shelf_location',
            'home_library',
            'current_library'
        ]);

        return Excel::download(
            new ItemPhysicalCopyExport($query->get()),
            'physical_items.xlsx'
        );
    }
}
