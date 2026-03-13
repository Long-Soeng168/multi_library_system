<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Library;
use App\Models\UserCategory;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserCategoryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // new Middleware('permission:user_category view', only: ['index', 'show']),
            // new Middleware('permission:user_category create', only: ['create', 'store']),
            // new Middleware('permission:user_category update', only: ['edit', 'update', 'recover']),
            // new Middleware('permission:user_category delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $library_code = null)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $type_code = $request->input('user_category_type_code');
        $trashed = $request->input('trashed');
        $library_id = $request->input('library_id');

        $query = UserCategory::query();

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

        if ($type_code) {
            $query->where('user_category_type_code', $type_code);
        }
        if ($library_id) {
            $query->where('library_id', $library_id);
        }

        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDirection);
        $query->with('created_user', 'updated_user', 'library');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/UserCategory/Index', [
            'tableData' => $tableData,
            'libraries' => Library::orderBy('id')->get(),
            'types' => Type::where('group_code', 'user-category-type-group')->orderBy('order_index')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/UserCategory/Create', [
            'types' => Type::where('group_code', 'user-category-type-group')->orderBy('order_index')->get(),
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'required|integer',
            'user_category_type_code' => 'nullable|string|exists:types,code',
            'enrollment_period_months' => 'required|integer|min:0',
            'enrollment_fee' => 'required|numeric|min:0',

            'fine_amount_per_day' => 'nullable|numeric|min:0|max:999999.99',
            'max_fines_amount' => 'nullable|numeric|min:0|max:999999.99',
            'borrowing_limit' => 'nullable|integer|min:0|max:1000',
            'loan_period' => 'nullable|integer|min:1|max:365', // Limit to a year max for safety
            'library_id' => 'nullable|integer|exists:libraries,id',
        ]);

        try {
            $validated['code'] = (string) Str::uuid();

            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            UserCategory::create($validated);

            return redirect()->back()->with('success', 'User Category created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Category: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $param1, $param2 = null)
    {
        if ($param2) {
            $library_code = $param1;
            $item_id = $param2;
        } else {
            $library_code = null;
            $item_id = $param1;
        }
        $userCategory = UserCategory::findOrFail($item_id);
        $library_id = $request->input('library_id', '');

        $user = $request->user();
        $isLibraryStaff = false;
        $hasGlobalPermission = $user->hasAnyPermission(['user view']);
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

        return Inertia::render('Admin/UserCategory/Create', [
            'editData' => $userCategory,
            'readOnly' => true,
            'types' => Type::where('group_code', 'user-category-type-group')->orderBy('order_index')->get(),
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, $param1, $param2 = null)
    {
        if ($param2) {
            $library_code = $param1;
            $item_id = $param2;
        } else {
            $library_code = null;
            $item_id = $param1;
        }
        $userCategory = UserCategory::findOrFail($item_id);
        $library_id = $request->input('library_id', '');

        $user = $request->user();
        $isLibraryStaff = false;
        $hasGlobalPermission = $user->hasAnyPermission(['user view']);
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

        return Inertia::render('Admin/UserCategory/Create', [
            'editData' => $userCategory,
            'types' => Type::where('group_code', 'user-category-type-group')->orderBy('order_index')->get(),
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserCategory $userCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'required|integer',
            'user_category_type_code' => 'nullable|string|exists:types,code',
            'enrollment_period_months' => 'required|integer|min:0',
            'enrollment_fee' => 'required|numeric|min:0',

            'fine_amount_per_day' => 'nullable|numeric|min:0|max:999999.99',
            'max_fines_amount' => 'nullable|numeric|min:0|max:999999.99',
            'borrowing_limit' => 'nullable|integer|min:0|max:1000',
            'loan_period' => 'nullable|integer|min:1|max:365', // Limit to a year max for safety
            'library_id' => 'nullable|integer|exists:libraries,id',
        ]);

        try {
            $validated['code'] = (string) Str::uuid();

            $validated['updated_by'] = $request->user()->id;

            $userCategory->update($validated);

            return redirect()->back()->with('success', 'User Category updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Category: ' . $e->getMessage());
        }
    }

    public function recover($id)
    {
        $category = UserCategory::withTrashed()->findOrFail($id);
        $category->restore();
        return redirect()->back()->with('success', 'Category recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserCategory $userCategory)
    {
        $userCategory->delete();
        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
