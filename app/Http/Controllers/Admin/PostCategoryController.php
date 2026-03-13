<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use App\Models\Type;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class PostCategoryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:post_category view', only: ['index', 'show']),
            new Middleware('permission:post_category create', only: ['create', 'store']),
            new Middleware('permission:post_category update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:post_category delete', only: ['destroy', 'destroy_image']),
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
        $category_code = $request->input('category_code');

        $query = PostCategory::query();


        $filteredCategory = PostCategory::where('code', $category_code)->first();
        $filteredParents = collect();
        if ($filteredCategory) {
            $filteredParents = $filteredCategory->allParents()->reverse()->values() ?: collect();

            // $allChildren = $filteredCategory->allChildren() ?: collect();
            // $childrenIds = $allChildren->pluck('id')->toArray();

            $query->where('parent_id', $filteredCategory->id);
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
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $query->with('created_user', 'updated_user', 'parent');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        // return $tableData;
        // return $filteredCategory;
        return Inertia::render('Admin/PostCategory/Index', [
            'tableData' => $tableData,
            'parents' => PostCategory::orderBy('order_index')->orderBy('id', 'desc')->get(),
            'filteredCategory' => $filteredCategory,
            'allParents' => $filteredParents,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Admin/PostCategory/Create', [
            'parents' => PostCategory::orderBy('order_index')->orderBy('id', 'desc')->get(),
            'filtered_category_id' => $request->filtered_category_id,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'parent_id' => 'nullable|string|max:255|exists:post_categories,id',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'required|numeric',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
        ]);
        // dd($request->all());


        try {
            // Add creator and updater
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            // Handle image upload if present
            if ($request->hasFile('image')) {
                $imageName = ImageHelper::uploadAndResizeImageWebp(
                    $request->file('image'),
                    'assets/images/post_categories',
                    600
                );
                $validated['image'] = $imageName;
            }

            // Create the Post Category
            PostCategory::create($validated);

            return redirect()->back()->with('success', 'Post Category created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Post Category: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(PostCategory $post_category)
    {
        return Inertia::render('Admin/PostCategory/Create', [
            'editData' => $post_category,
            'readOnly' => true,
            'parents' => PostCategory::where('id', '!=', $post_category->id)->orderBy('order_index')->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PostCategory $post_category)
    {
        return Inertia::render('Admin/PostCategory/Create', [
            'editData' => $post_category,
            'parents' => PostCategory::where('id', '!=', $post_category->id)->orderBy('order_index')->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PostCategory $post_category)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'parent_id' => 'nullable|string|max:255|exists:post_categories,id',
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
                    'assets/images/post_categories',
                    600
                );

                $validated['image'] = $imageName;

                // delete old if replaced
                if ($imageName && $post_category->image) {
                    ImageHelper::deleteImage($post_category->image, 'assets/images/post_categories');
                }
            }

            // Update
            $post_category->update($validated);

            return redirect()->back()->with('success', 'Post Category updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Post Category: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $post_category = PostCategory::withTrashed()->findOrFail($id); // 👈 include soft-deleted Post Category
        $post_category->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Post Category recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostCategory $post_category)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $post_category->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Post Category deleted successfully.');
    }
}
