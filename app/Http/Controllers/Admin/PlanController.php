<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class PlanController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:plan view', only: ['index', 'show']),
            new Middleware('permission:plan create', only: ['create', 'store']),
            new Middleware('permission:plan update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:plan delete', only: ['destroy', 'destroy_image']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $trashed = $request->input('trashed'); // '', 'with', 'only'

        $query = Plan::query();

        // 🗑️ Soft delete filter
        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        // billing cycle
        if ($request->billing_cycle) {
            $query->where('billing_cycle', $request->billing_cycle);
        }

        // popular
        if ($request->is_popular !== null && $request->is_popular !== '') {
            $query->where('is_popular', $request->boolean('is_popular'));
        }

        // free / paid
        if ($request->type === 'free') {
            $query->where('price', 0);
        }

        if ($request->type === 'paid') {
            $query->where('price', '>', 0);
        }

        // 🔍 Search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%")
                    ->orWhere('price', 'LIKE', "%{$search}%")
                    ->orWhere('billing_cycle', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        // 🔽 Sorting (safe whitelist)
        $allowedSorts = ['id', 'name', 'price', 'billing_cycle', 'order_index', 'created_at'];

        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        $query->orderBy($sortBy, $sortDirection);

        // 🔥 Relations
        $query->with(['created_user', 'updated_user']);

        $tableData = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Plan/Index', [
            'filters' => $request->only(['search', 'perPage', 'sortBy', 'sortDirection', 'trashed']),
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Admin/Plan/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'billing_cycle_label' => 'nullable|string|max:255',
            'billing_cycle_label_kh' => 'nullable|string|max:255',

            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'nullable|in:forever,monthly,yearly',

            'max_books' => 'nullable|integer',
            'max_members' => 'nullable|integer',
            'max_storage_mb' => 'nullable|integer',

            'is_popular' => 'nullable|boolean',
            'order_index' => 'required|integer',

            'button_label' => 'nullable|string|max:255',
            'button_label_kh' => 'nullable|string|max:255',
            'action_url' => 'nullable|string|max:255',

            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
        ]);

        try {
            // ✅ Normalize data
            $validated['is_popular'] = $request->boolean('is_popular');

            // ✅ Default limits (-1 = unlimited)
            $validated['max_books'] = $validated['max_books'] ?? 0;
            $validated['max_members'] = $validated['max_members'] ?? 0;
            $validated['max_storage_mb'] = $validated['max_storage_mb'] ?? 0;

            // ✅ Audit
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            Plan::create($validated);

            return redirect()->back()->with('success', 'Plan created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Plan: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Plan $plan)
    {
        // dd($plan->loadCount('children'));
        return Inertia::render('Admin/Plan/Create', [
            'editData' => $plan,
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Plan $plan)
    {
        return Inertia::render('Admin/Plan/Create', [
            'editData' => $plan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'billing_cycle_label' => 'nullable|string|max:255',
            'billing_cycle_label_kh' => 'nullable|string|max:255',

            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'nullable|in:forever,monthly,yearly',

            'max_books' => 'nullable|integer',
            'max_members' => 'nullable|integer',
            'max_storage_mb' => 'nullable|integer',

            'is_popular' => 'nullable|boolean',
            'order_index' => 'required|integer',

            'button_label' => 'nullable|string|max:255',
            'button_label_kh' => 'nullable|string|max:255',
            'action_url' => 'nullable|string|max:255',

            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
        ]);

        try {
            // ✅ Normalize boolean
            $validated['is_popular'] = $request->boolean('is_popular');

            // ✅ Default limits (-1 = unlimited)
            $validated['max_books'] = $validated['max_books'] ?? 0;
            $validated['max_members'] = $validated['max_members'] ?? 0;
            $validated['max_storage_mb'] = $validated['max_storage_mb'] ?? 0;

            // ✅ Audit
            $validated['updated_by'] = $request->user()->id;

            // 🔥 Optional: only one popular plan
            if ($validated['is_popular']) {
                Plan::where('id', '!=', $plan->id)
                    ->where('is_popular', true)
                    ->update(['is_popular' => false]);
            }

            // ✅ Update
            $plan->update($validated);

            return redirect()->back()->with('success', 'Plan updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Plan: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $plan = Plan::withTrashed()->findOrFail($id); // 👈 include soft-deleted Plan
        $plan->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Plan recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plan $plan)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $plan->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Plan deleted successfully.');
    }
}
