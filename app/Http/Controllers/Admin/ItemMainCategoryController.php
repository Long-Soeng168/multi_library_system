<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\ItemMainCategory;
use App\Models\Library;
use App\Models\Type;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ItemMainCategoryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:item_category view', only: ['index', 'show']),
            new Middleware('permission:item_category create', only: ['create', 'store']),
            new Middleware('permission:item_category update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:item_category delete', only: ['destroy', 'destroy_image']),
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
        $library_id = $request->input('library_id', '');

        $query = ItemMainCategory::query();

        if ($library_id) {
            $query->where('library_id', $library_id);
        }

        // Filter by trashed (soft deletes)
        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $query->with('created_user', 'updated_user', 'library');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        // return $tableData;
        // return $filteredCategory;
        return Inertia::render('Admin/ItemMainCategory/Index', [
            'tableData' => $tableData,
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Admin/ItemMainCategory/Create', [
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'library_id' => 'nullable|integer|exists:libraries,id',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'required|numeric',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
        ]);
        // dd($request->all());

        try {
            $validated['code'] = (string) Str::uuid();
            // Add creator and updater
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            // Handle image upload if present
            if ($request->hasFile('image')) {
                $imageName = ImageHelper::uploadAndResizeImageWebp(
                    $request->file('image'),
                    'assets/images/item_categories',
                    600
                );
                $validated['image'] = $imageName;
            }

            // Create the Item Main Category
            ItemMainCategory::create($validated);

            return redirect()->back()->with('success', 'Item Main Category created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Item Main Category: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ItemMainCategory $item_main_category)
    {
        return Inertia::render('Admin/ItemMainCategory/Create', [
            'editData' => $item_main_category,
            'readOnly' => true,
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ItemMainCategory $item_main_category)
    {
        return Inertia::render('Admin/ItemMainCategory/Create', [
            'editData' => $item_main_category,
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ItemMainCategory $item_main_category)
    {
        $validated = $request->validate([
            'library_id' => 'nullable|integer|exists:libraries,id',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'required|numeric',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
        ]);

        try {
            // track updater
            $validated['updated_by'] = $request->user()->id;

            $imageFile = $request->file('image');
            unset($validated['image']);

            // Handle image upload if present
            if ($imageFile) {
                $imageName = ImageHelper::uploadAndResizeImageWebp(
                    $imageFile,
                    'assets/images/item_categories',
                    600
                );

                $validated['image'] = $imageName;

                // delete old if replaced
                if ($imageName && $item_main_category->image) {
                    ImageHelper::deleteImage($item_main_category->image, 'assets/images/item_categories');
                }
            }

            // Update
            $item_main_category->update($validated);

            return redirect()->back()->with('success', 'Item Main Category updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Item Main Category: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $item_main_category = ItemMainCategory::withTrashed()->findOrFail($id); // 👈 include soft-deleted Item Main Category
        $item_main_category->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Item Main Category recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItemMainCategory $item_main_category)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $item_main_category->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Item Main Category deleted successfully.');
    }
}
