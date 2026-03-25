<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Library;
use App\Models\Plan;
use App\Models\Subscription;

use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class SubscriptionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:subscription view', only: ['index', 'show']),
            new Middleware('permission:subscription create', only: ['create']),
            new Middleware('permission:subscription update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:subscription delete', only: ['destroy', 'destroy_image']),
        ];
    }

    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $trashed = $request->input('trashed'); // '', 'with', 'only'

        $query = Subscription::query();

        // ✅ Soft deletes filter
        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->plan_id) {
            $query->where('plan_id', $request->plan_id);
        }
        if ($request->library_id) {
            $query->where('library_id', $request->library_id);
        }

        // ✅ Search (library, plan, status, etc.)
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'LIKE', "%{$search}%")
                    ->orWhere('status', 'LIKE', "%{$search}%")
                    ->orWhereHas('plan', function ($planQuery) use ($search) {
                        $planQuery->where('name', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('library', function ($libQuery) use ($search) {
                        $libQuery->where('name', 'LIKE', "%{$search}%");
                    });
            });
        }

        // ✅ Sorting (safe fallback)
        $allowedSorts = ['id', 'created_at', 'updated_at', 'started_at', 'expires_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $query->orderBy($sortBy, $sortDirection);

        // ✅ Eager load relations
        $query->with([
            'plan',
            'library',
            'created_user',
            'updated_user'
        ]);

        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/Subscription/Index', [
            'tableData' => $tableData,
            'plans' => Plan::orderBy('order_index')->get(['id', 'name', 'price', 'billing_cycle']),
            'libraries' => Library::orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Admin/Subscription/Create', [
            'plans' => Plan::orderBy('order_index')->get(['id', 'name', 'price', 'billing_cycle']),
            'libraries' => Library::orderBy('name')->get(),
        ]);
    }
    public function subscribe_to_plan(Request $request)
    {
        $selected_plan = Plan::findOrFail($request->plan_id);
        $selected_library = Library::find($request->user()->library_id);

        if (!$selected_library) {
            return redirect('/create-library');
        }

        return Inertia::render('Admin/Subscription/Create', [
            'plans' => Plan::orderBy('order_index')->get(['id', 'name', 'price', 'billing_cycle']),
            'libraries' => Library::orderBy('name')->get(),
            'selected_plan' => $selected_plan,
            'selected_library' => $selected_library,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'library_id' => 'required|exists:libraries,id',
            'plan_id' => 'required|exists:plans,id',

            'status' => 'required|in:active,pending,expired,canceled',

            'started_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:started_at',

            'payment_proof_image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
        ]);

        try {
            // ✅ Defaults
            $validated['started_at'] = $validated['started_at'] ?? now();

            // Example: auto calculate expires_at if not provided (monthly)
            if (empty($validated['expires_at'])) {
                $plan = \App\Models\Plan::find($validated['plan_id']);

                if ($plan && $plan->billing_cycle === 'monthly') {
                    $validated['expires_at'] = now()->addMonth();
                } elseif ($plan && $plan->billing_cycle === 'yearly') {
                    $validated['expires_at'] = now()->addYear();
                }
            }

            // ✅ Audit
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            if ($request->hasFile('payment_proof_image')) {
                $payment_proof_imageName = ImageHelper::uploadAndResizeImageWebp(
                    $request->file('payment_proof_image'),
                    'assets/images/subscriptions',
                    600
                );
                $validated['payment_proof_image'] = $payment_proof_imageName;
            }

            Subscription::create($validated);

            return redirect()->back()->with('success', 'Subscription created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Subscription: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Subscription $subscription)
    {
        // dd($subscription->loadCount('children'));
        return Inertia::render('Admin/Subscription/Create', [
            'editData' => $subscription,
            'readOnly' => true,
            'plans' => Plan::orderBy('order_index')->get(['id', 'name', 'price', 'billing_cycle']),
            'libraries' => Library::orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subscription $subscription)
    {
        return Inertia::render('Admin/Subscription/Create', [
            'editData' => $subscription,
            'plans' => Plan::orderBy('order_index')->get(['id', 'name', 'price', 'billing_cycle']),
            'libraries' => Library::orderBy('name')->get(),
        ]);
    }


    public function update(Request $request, Subscription $subscription)
    {
        $validated = $request->validate([
            'library_id' => 'required|exists:libraries,id',
            'plan_id' => 'required|exists:plans,id',

            'status' => 'required|in:active,pending,expired,canceled',

            'started_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:started_at',

            'payment_proof_image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',

        ]);

        try {
            // ✅ Default start date
            $validated['started_at'] = $validated['started_at'] ?? now();

            // ✅ Auto adjust end date if not provided
            if (empty($validated['expires_at'])) {
                $plan = Plan::find($validated['plan_id']);

                if ($plan && $plan->billing_cycle === 'monthly') {
                    $validated['expires_at'] = now()->addMonth();
                } elseif ($plan && $plan->billing_cycle === 'yearly') {
                    $validated['expires_at'] = now()->addYear();
                }
            }

            // ✅ Audit
            $validated['updated_by'] = $request->user()->id;

            // 🔥 Optional: prevent multiple active subscriptions
            if ($validated['status'] === 'active') {
                Subscription::where('library_id', $validated['library_id'])
                    ->where('id', '!=', $subscription->id)
                    ->where('status', 'active')
                    ->update(['status' => 'expired']);
            }

            $payment_proof_imageFile = $request->file('payment_proof_image');
            unset($validated['payment_proof_image']);
            if ($payment_proof_imageFile) {
                $payment_proof_imageName = ImageHelper::uploadAndResizeImageWebp(
                    $payment_proof_imageFile,
                    'assets/images/subscriptions',
                    1440,
                );

                $validated['payment_proof_image'] = $payment_proof_imageName;

                // delete old if replaced
                if ($payment_proof_imageName && $subscription->payment_proof_image) {
                    ImageHelper::deleteImage($subscription->payment_proof_image, 'assets/images/subscriptions');
                }
            }

            $subscription->update($validated);

            return redirect()->back()->with('success', 'Subscription updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Subscription: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $subscription = Subscription::withTrashed()->findOrFail($id); // 👈 include soft-deleted Page
        $subscription->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Plan recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subscription $subscription)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $subscription->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Subscription deleted successfully.');
    }
}
