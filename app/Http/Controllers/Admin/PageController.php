<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\PageImage;
use App\Models\Type;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class PageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:page view', only: ['index', 'show']),
            new Middleware('permission:page create', only: ['create', 'store']),
            new Middleware('permission:page update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:page delete', only: ['destroy', 'destroy_image']),
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
        $type_code = $request->input('type_code');
        $trashed = $request->input('trashed'); // '', 'with', 'only'

        $selected_page_id = $request->input('selected_page_id');
        $selectedPage = Page::find($selected_page_id);
        $selectedPageParents = collect();

        if ($selectedPage) {
            $selectedPageParents = $selectedPage->allParents()->reverse()->values() ?: collect();
        }

        $query = Page::query();

        if ($type_code) {
            $query->where('type_code', $type_code);
        }

        if ($selectedPage) {
            $query->where('parent_code', $selectedPage->code)->where('parent_code', '!=', null);
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
                    ->orWhere('type_code', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $query->with('created_user', 'updated_user', 'type');


        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/Page/Index', [
            'tableData' => $tableData,
            'selectedPage' => $selectedPage,
            'selectedPageParents' => $selectedPageParents,
            'types' => Type::where('group_code', 'page-type-group')->orderBy('order_index')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Admin/Page/Create', [
            'types' => Type::where('group_code', 'page-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'selected_page_code' => $request->input('selected_page_code'),
            'parents' => Page::where('code', '!=', null)->orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());

        $validated = $request->validate([
            'code' => 'nullable|string|max:255|unique:pages,code',
            'parent_code' => 'nullable|string|max:255|exists:pages,code',
            'type_code' => 'nullable|string|max:255|exists:types,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'button_title' => 'nullable|string|max:255',
            'button_title_kh' => 'nullable|string|max:255',
            'link' => 'nullable|string',
            'icon' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
            'order_index' => 'required|numeric',
        ]);

        if (trim($validated['long_description']) === '<p>&nbsp;</p>') {
            $validated['long_description'] = null;
        }

        if (trim($validated['long_description_kh']) === '<p>&nbsp;</p>') {
            $validated['long_description_kh'] = null;
        }

        try {
            // Add creator and updater
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            // Handle image upload if present
            if ($request->hasFile('icon')) {
                $imageName = ImageHelper::uploadAndResizeImageWebp(
                    $request->file('icon'),
                    'assets/images/pages',
                    600
                );
                $validated['icon'] = $imageName;
            }

            $image_files = $request->file('images');
            unset($validated['images']);

            // Create the Page
            $created_page = Page::create($validated);

            if ($image_files) {
                try {
                    foreach ($image_files as $image) {
                        $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/pages', 600);
                        PageImage::create([
                            'image' => $created_image_name,
                            'page_id' => $created_page->id,
                        ]);
                    }
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
                }
            }

            return redirect()->back()->with('success', 'Page created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Page: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        // dd($page->loadCount('children'));
        return Inertia::render('Admin/Page/Create', [
            'editData' => $page->loadCount('children')->load('images'),
            'readOnly' => true,
            'types' => Type::where('group_code', 'page-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'parents' => Page::where('code', '!=', null)->orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Page $page)
    {
        return Inertia::render('Admin/Page/Create', [
            'editData' => $page->loadCount('children')->load('images'),
            'types' => Type::where('group_code', 'page-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'parents' => Page::where('code', '!=', null)->orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Page $page)
    {
        // dd($request->all());
        $validated = $request->validate([
            'code' => 'nullable|string|max:255|unique:pages,code,' . $page->id,
            'parent_code' => 'nullable|string|max:255|exists:pages,code',
            'type_code' => 'nullable|string|max:255|exists:types,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'button_title' => 'nullable|string|max:255',
            'button_title_kh' => 'nullable|string|max:255',
            'link' => 'nullable|string',
            'icon' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
            'images.*' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
            'order_index' => 'required|numeric',
        ]);

        if (trim($validated['long_description']) === '<p>&nbsp;</p>') {
            $validated['long_description'] = null;
        }

        if (trim($validated['long_description_kh']) === '<p>&nbsp;</p>') {
            $validated['long_description_kh'] = null;
        }

        try {
            // track updater
            $validated['updated_by'] = $request->user()->id;

            $imageFile = $request->file('icon');
            unset($validated['icon']);

            // Handle image upload if present
            if ($imageFile) {
                $imageName = ImageHelper::uploadAndResizeImageWebp(
                    $imageFile,
                    'assets/images/pages',
                    600
                );

                $validated['icon'] = $imageName;

                // delete old if replaced
                if ($imageName && $page->image) {
                    ImageHelper::deleteImage($page->image, 'assets/images/pages');
                }
            }

            $image_files = $request->file('images');
            unset($validated['images']);

            // Update
            $page->update($validated);

            if ($image_files) {
                try {
                    foreach ($image_files as $image) {
                        $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/pages', 600);
                        PageImage::create([
                            'image' => $created_image_name,
                            'page_id' => $page->id,
                        ]);
                    }
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
                }
            }

            return redirect()->back()->with('success', 'Page updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Page: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $page = Page::withTrashed()->findOrFail($id); // 👈 include soft-deleted Page
        $page->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Page recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $page->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Page deleted successfully.');
    }

    public function destroy_image(PageImage $image)
    {
        // Debugging (Check if model is found)
        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        // Call helper function to delete image
        ImageHelper::deleteImage($image->image, 'assets/images/pages');

        // Delete from DB
        $image->delete();

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }
}
