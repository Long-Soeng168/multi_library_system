<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ItemExport;
use App\Helpers\FileHelper;
use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Language;
use App\Models\ItemCategory;
use App\Models\ItemFile;
use App\Models\ItemImage;
use App\Models\ItemMainCategory;
use App\Models\ItemPhysicalCopy;
use App\Models\Library;
use App\Models\Type;
use App\Models\User;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ItemController extends Controller implements HasMiddleware
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
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $library_code = null)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $file_type_code = $request->input('file_type_code');
        $main_category_code = $request->input('main_category_code');
        $category_code = $request->input('category_code');
        $language_code = $request->input('language_code');
        $status = $request->input('status');
        $publisher_id = $request->input('publisher_id');
        $advisor_id = $request->input('advisor_id');
        $author_id = $request->input('author_id');
        $trashed = $request->input('trashed'); // '', 'with', 'only'

        $library_id = $request->input('library_id', '');

        $query = Item::query();

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

        if ($file_type_code) {
            $query->where('file_type_code', $file_type_code);
        }

        if ($author_id) {
            $query->whereHas('authors', function ($q) use ($author_id) {
                $q->where('author_id', $author_id);
            });
        }

        if ($advisor_id) {
            $query->where('advisor_id', $advisor_id);
        }
        if ($publisher_id) {
            $query->where('publisher_id', $publisher_id);
        }
        if ($main_category_code) {
            $query->where('main_category_code', $main_category_code);
        }
        if ($category_code) {
            $category = ItemCategory::where('code', $category_code)->first();
            $categoryChildren = [];
            if (!empty($category)) {
                $categoryChildren = $category->allChildren()->pluck('code')->toArray();
                // return $categoryChildren;
            }
            $query->where(function ($sub_query) use ($category_code, $categoryChildren) {
                return $sub_query->where('category_code', $category_code)
                    ->orWhereIn('category_code', $categoryChildren);
            });
        }
        if ($language_code) {
            $query->where('language_code', $language_code);
        }
        if ($status) {
            $query->where('status', $status);
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
                    ->orWhere('file_type_code', 'LIKE', "%{$search}%")
                    ->orWhere('category_code', 'LIKE', "%{$search}%")
                    ->orWhere('keywords', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $query->with('created_user', 'updated_user', 'file_type', 'category', 'library');

        $tableData = $query->paginate($perPage)->onEachSide(2);

        $categories = ItemCategory::where('parent_id', null)
            ->when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })
            ->where('item_main_category_code', $main_category_code)
            ->orderBy('order_index')
            ->withCount('items')
            ->get();

        return Inertia::render('Admin/Item/Index', [
            'tableData' => $tableData,
            'fileTypes' => Type::where('group_code', 'item-file-type-group')->withCount('file_type_items')->orderBy('order_index')->orderBy('name')->get(),
            'languages' => Language::orderBy('order_index')->withCount('items')->orderBy('name')->get(),
            'categories' => $categories,
            'mainCategories' => ItemMainCategory::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('order_index')
                ->when($library_id, function ($query) use ($library_id) {
                    $query->where('library_id', $library_id);
                })
                ->withCount('items')
                ->orderBy('name')
                ->get(),

            'subCategories' => ItemCategory::orderBy('order_index')
                ->when($library_id, function ($query) use ($library_id) {
                    $query->where('library_id', $library_id);
                })
                ->orderByDesc('id')
                ->whereNotNull('parent_id')
                ->with(['parent:id,code'])
                ->get(),
            'main_category_code' => $main_category_code,
            'publishers' => User::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderByDesc('publisher_items_count')->withCount('publisher_items')->role('Publisher')->get(),
            'advisors' => true ? [] : User::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderByDesc('advisor_items_count')->withCount('advisor_items')->role('Advisor')->get(),
            'authors' => User::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderByDesc('author_items_count')->withCount('author_items')->role('Author')->get(),
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, $library_code = null)
    {
        $library_id = $request->input('library_id', '');

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
        $main_category_code = $request->main_category_code;
        return Inertia::render('Admin/Item/Create', [
            'fileTypes' => Type::where('group_code', 'item-file-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'mainCategories' => ItemMainCategory::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('order_index')->orderBy('id', 'desc')->get(),
            'categories' => ItemCategory::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('order_index')
                ->orderByDesc('id')
                ->where('parent_id', null)
                ->get(),
            'subCategories' => ItemCategory::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('order_index')
                ->orderByDesc('id')
                ->whereNotNull('parent_id')
                ->with(['parent:id,code'])
                ->get(),
            'main_category_code' => $main_category_code,
            'languages' => Language::orderBy('order_index')->orderBy('name')->get(),
            'publishers' => User::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('name')->role('Publisher')->get(),
            'authors' => User::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('name')->role('Author')->get(),
            'advisors' => true ? [] : User::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('name')->role('Advisor')->get(),
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'library_id' => 'nullable|integer|exists:libraries,id',
            'main_category_code' => 'nullable|string|max:255|exists:item_main_categories,code',
            'category_code' => 'nullable|string|max:255|exists:item_categories,code',
            'file_type_code' => 'nullable|string|max:255|exists:types,code',
            'language_code' => 'nullable|string|max:255|exists:languages,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'keywords' => 'nullable|string|max:500',
            'status' => 'nullable|string|max:255',

            'edition' => 'nullable|string|max:255',
            'ddc' => 'nullable|string|max:255',
            'lcc' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:255',
            'eisbn' => 'nullable|string|max:255',
            'doi' => 'nullable|string|max:255',

            'author_ids' => 'nullable|array',

            'author_name' => 'nullable|string|max:255',
            'advisor_id' => 'nullable|exists:users,id',
            'publisher_id' => 'nullable|exists:users,id',
            'published_year' => 'nullable|numeric|min:1000',
            'published_month' => 'nullable|numeric|min:1|max:12',
            'published_day' => 'nullable|numeric|min:1|max:31',
            'total_page' => 'nullable|numeric',

            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'external_link' => 'nullable|string',
            'thumbnail' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
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
            if ($request->hasFile('thumbnail')) {
                $imageName = ImageHelper::uploadAndResizeImageWebp(
                    $request->file('thumbnail'),
                    'assets/images/items',
                    600
                );
                $validated['thumbnail'] = $imageName;
            }

            if ($request->hasFile('default_file')) {
                $fileName =  FileHelper::uploadFile($request->file('default_file'), 'assets/files/items', true);
                $validated['file_name'] = $fileName;
            }

            $image_files = $request->file('images');
            unset($validated['images']);

            $item_files = $request->file('files');
            unset($validated['files']);

            $authorIds = collect($validated['author_ids'] ?? [])
                ->pluck('value')   // get just the IDs
                ->filter()         // remove empty/null values
                ->map(fn($id) => (int) $id) // convert to int if needed
                ->toArray();
            // dd($authorIds);

            // Remove from validated before updating the item
            unset($validated['author_ids']);

            // Create the Item
            $created_item = Item::create($validated);

            $created_item->authors()->sync($authorIds);


            if ($image_files) {
                try {
                    foreach ($image_files as $image) {
                        $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/items', 600);
                        ItemImage::create([
                            'image' => $created_image_name,
                            'item_id' => $created_item->id,
                        ]);
                    }
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
                }
            }
            if ($item_files) {
                try {
                    foreach ($item_files as $item_file) {
                        $created_file_name = FileHelper::uploadFile($item_file, 'assets/files/items', true);

                        if ($created_file_name) {
                            ItemFile::create([
                                'file_name' => $created_file_name,
                                'file_type' => $item_file->getClientMimeType(),
                                'item_id' => $created_item->id,
                            ]);
                        }
                    }
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to upload files: ' . $e->getMessage());
                }
            }


            return redirect()->back()->with('success', 'Item created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Item: ' . $e->getMessage());
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
        $item = Item::findOrFail($item_id);
        $library_id = $request->input('library_id', '');

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
        // dd($item->loadCount('category'));
        return Inertia::render('Admin/Item/Show', [
            'view_physical_copies' => $request->view_physical_copies == 1 ? true : false,
            'showData' => $item->loadCount('category')->load('physical_copies.item_type', 'physical_copies.library', 'physical_copies.home_library', 'physical_copies.current_library', 'images', 'files', 'authors', 'publisher', 'language'),
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
        $item = Item::findOrFail($item_id);
        $library_id = $request->input('library_id', '');

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
        // dd($item);
        return Inertia::render('Admin/Item/Create', [
            'editData' => $item->loadCount('category')->load('images', 'files', 'authors'),
            'fileTypes' => Type::where('group_code', 'item-file-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'mainCategories' => ItemMainCategory::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('order_index')->orderBy('id', 'desc')->get(),

            'selectedCategory' => ItemCategory::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->where('code', $item->category_code)->with('parent')->first(),
            'categories' => ItemCategory::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('order_index')
                ->orderByDesc('id')
                ->where('parent_id', null)
                ->get(),
            'subCategories' => ItemCategory::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('order_index')
                ->orderByDesc('id')
                ->whereNotNull('parent_id')
                ->with(['parent:id,code'])
                ->get(),
            'languages' => Language::orderBy('order_index')->orderBy('name')->get(),
            'publishers' => User::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('name')->role('Publisher')->get(),
            'authors' => User::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('name')->role('Author')->get(),
            'advisors' => true ? [] : User::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('name')->role('Advisor')->get(),
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        // dd($request->all());
        $validated = $request->validate([
            'library_id' => 'nullable|integer|exists:libraries,id',
            'main_category_code' => 'nullable|string|max:255|exists:item_main_categories,code',
            'category_code' => 'nullable|string|max:255|exists:item_categories,code',
            'file_type_code' => 'nullable|string|max:255|exists:types,code',
            'language_code' => 'nullable|string|max:255|exists:languages,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'keywords' => 'nullable|string|max:500',
            'status' => 'nullable|string|max:255',

            'edition' => 'nullable|string|max:255',
            'ddc' => 'nullable|string|max:255',
            'lcc' => 'nullable|string|max:255',
            'isbn' => 'nullable|string|max:255',
            'eisbn' => 'nullable|string|max:255',
            'doi' => 'nullable|string|max:255',

            'author_ids' => 'nullable|array',

            'author_name' => 'nullable|string|max:255',
            'advisor_id' => 'nullable|exists:users,id',
            'publisher_id' => 'nullable|exists:users,id',
            'published_year' => 'nullable|numeric|min:1900',
            'published_month' => 'nullable|numeric|min:1|max:12',
            'published_day' => 'nullable|numeric|min:1|max:31',
            'total_page' => 'nullable|numeric',

            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'external_link' => 'nullable|string',
            'thumbnail' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
            'images.*' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
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

            $imageFile = $request->file('thumbnail');
            unset($validated['thumbnail']);

            // Handle image upload if present
            if ($imageFile) {
                $imageName = ImageHelper::uploadAndResizeImageWebp(
                    $imageFile,
                    'assets/images/items',
                    600
                );

                $validated['thumbnail'] = $imageName;

                // delete old if replaced
                // if ($imageName && $item->image) {
                //     ImageHelper::deleteImage($item->image, 'assets/images/items');
                // }
            }
            if ($request->hasFile('default_file')) {
                $fileName =  FileHelper::uploadFile($request->file('default_file'), 'assets/files/items', true);
                $validated['file_name'] = $fileName;
            }
            // Handle image upload if present
            if ($request->hasFile('default_file')) {
                $fileName =  FileHelper::uploadFile($request->file('default_file'), 'assets/files/items', true);

                $validated['file_name'] = $fileName;

                // delete old if replaced
                // if ($fileName && $item->file_name) {
                //     FileHelper::deleteFile($item->file_name, 'assets/files/items');
                // }
            }

            $image_files = $request->file('images');
            unset($validated['images']);

            $item_files = $request->file('files');
            unset($validated['files']);

            // Extract author IDs from array of {value, label} objects
            $authorIds = collect($validated['author_ids'] ?? [])
                ->pluck('value')   // get just the IDs
                ->filter()         // remove empty/null values
                ->map(fn($id) => (int) $id) // convert to int if needed
                ->toArray();

            // dd($authorIds);

            // Remove from validated before updating the item
            unset($validated['author_ids']);

            // Update
            $item->update($validated);

            ItemPhysicalCopy::where('item_id', $item->id)
                ->update([
                    'library_id' => $item->library_id
                ]);

            $item->authors()->sync($authorIds);

            if ($image_files) {
                try {
                    foreach ($image_files as $image) {
                        $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/items', 600);
                        ItemImage::create([
                            'image' => $created_image_name,
                            'item_id' => $item->id,
                        ]);
                    }
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
                }
            }

            if ($item_files) {
                try {
                    foreach ($item_files as $item_file) {
                        $created_file_name = FileHelper::uploadFile($item_file, 'assets/files/items', true);

                        if ($created_file_name) {
                            ItemFile::create([
                                'file_name' => $created_file_name,
                                'file_type' => $item_file->getClientMimeType(),
                                'item_id' => $item->id,
                            ]);
                        }
                    }
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to upload files: ' . $e->getMessage());
                }
            }

            return redirect()->back()->with('success', 'Item updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Item: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $item = Item::withTrashed()->findOrFail($id); // 👈 include soft-deleted Item
        $item->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Item recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $item->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Item deleted successfully.');
    }

    public function destroy_image(ItemImage $image)
    {
        // Debugging (Check if model is found)
        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        // Call helper function to delete image
        ImageHelper::deleteImage($image->image, 'assets/images/items');

        // Delete from DB
        $image->delete();

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }
    public function destroy_file(ItemFile $file)
    {
        // Debugging (Check if model is found)
        if (!$file) {
            return redirect()->back()->with('error', 'File not found.');
        }

        // Call helper function to delete image
        // FileHelper::deleteFile($file->file_name, 'assets/files/items');

        // Delete from DB
        $file->delete();

        return redirect()->back()->with('success', 'File deleted successfully.');
    }

    // EXPORT
    public function export_items(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $file_type_code = $request->input('file_type_code');
        $main_category_code = $request->input('main_category_code');
        $category_code = $request->input('category_code');
        $language_code = $request->input('language_code');
        $status = $request->input('status');
        $publisher_id = $request->input('publisher_id');
        $advisor_id = $request->input('advisor_id');
        $author_id = $request->input('author_id');
        $trashed = $request->input('trashed');

        $query = Item::query();

        if ($file_type_code) $query->where('file_type_code', $file_type_code);

        if ($author_id) {
            $query->whereHas('authors', fn($q) => $q->where('author_id', $author_id));
        }

        if ($advisor_id) $query->where('advisor_id', $advisor_id);
        if ($publisher_id) $query->where('publisher_id', $publisher_id);
        if ($main_category_code) $query->where('main_category_code', $main_category_code);

        if ($category_code) {
            $category = ItemCategory::where('code', $category_code)->first();
            $children = $category?->allChildren()->pluck('code')->toArray() ?? [];

            $query->where(function ($q) use ($category_code, $children) {
                $q->where('category_code', $category_code)
                    ->orWhereIn('category_code', $children);
            });
        }

        if ($language_code) $query->where('language_code', $language_code);
        if ($status) $query->where('status', $status);

        if ($trashed === 'with') $query->withTrashed();
        elseif ($trashed === 'only') $query->onlyTrashed();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('file_type_code', 'LIKE', "%{$search}%")
                    ->orWhere('category_code', 'LIKE', "%{$search}%")
                    ->orWhere('keywords', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        $rows = $query
            ->with([
                'created_user:id,name',
                'updated_user:id,name',
                'publisher:id,name',
                'advisor:id,name',
                'authors:id,name',
                'language:code,name',
                'category:code,name',
                'file_type:code,name',
            ])
            ->orderBy($sortBy, $sortDirection)
            ->get();

        return Excel::download(new ItemExport($rows), 'items.xlsx');
    }
}
