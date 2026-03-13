<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\FileHelper;
use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\PostFile;
use App\Models\PostImage;
use App\Models\Type;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class PostController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:post view', only: ['index', 'show']),
            new Middleware('permission:post create', only: ['create', 'store']),
            new Middleware('permission:post update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:post delete', only: ['destroy', 'destroy_image']),
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
        $category_code = $request->input('category_code');
        $language_code = $request->input('language_code');
        $status = $request->input('status');
        $trashed = $request->input('trashed'); // '', 'with', 'only'

        $query = Post::query();


        if ($type_code) {
            $query->where('type_code', $type_code);
        }
        if ($category_code) {
            $query->where('category_code', $category_code);
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
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('type_code', 'LIKE', "%{$search}%")
                    ->orWhere('category_code', 'LIKE', "%{$search}%")
                    ->orWhere('keywords', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $query->with('created_user', 'updated_user', 'type');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/Post/Index', [
            'tableData' => $tableData,
            'types' => Type::where('group_code', 'post-type-group')->orderBy('order_index')->orderBy('name')->get(),
            'languages' => Language::orderBy('order_index')->orderBy('name')->get(),
            'categories' => PostCategory::orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Post/Create', [
            'types' => Type::where('group_code', 'post-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'categories' => PostCategory::orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'languages' => Language::orderBy('order_index')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());

        $validated = $request->validate([
            'category_code' => 'nullable|string|max:255|exists:post_categories,code',
            'type_code' => 'nullable|string|max:255|exists:types,code',
            'language_code' => 'nullable|string|max:255|exists:languages,code',
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'keywords' => 'nullable|string|max:500',
            'status' => 'nullable|string|max:255',
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
                    'assets/images/posts',
                    600
                );
                $validated['thumbnail'] = $imageName;
            }

            $image_files = $request->file('images');
            unset($validated['images']);

            $item_files = $request->file('files');
            unset($validated['files']);

            // Create the Post
            $created_post = Post::create($validated);

            if ($image_files) {
                try {
                    foreach ($image_files as $image) {
                        $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/posts', 600);
                        PostImage::create([
                            'image' => $created_image_name,
                            'post_id' => $created_post->id,
                        ]);
                    }
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
                }
            }
            if ($item_files) {
                try {
                    foreach ($item_files as $item_file) {
                        $created_file_name = FileHelper::uploadFile($item_file, 'assets/files/posts', false);

                        if ($created_file_name) {
                            PostFile::create([
                                'file_name' => $created_file_name,
                                'file_type' => $item_file->getClientMimeType(),
                                'post_id' => $created_post->id,
                            ]);
                        }
                    }
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to upload files: ' . $e->getMessage());
                }
            }


            return redirect()->back()->with('success', 'Post created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Post: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        // dd($post->loadCount('category'));
        return Inertia::render('Admin/Post/Create', [
            'editData' => $post->loadCount('category')->load('images', 'files'),
            'readOnly' => true,
            'types' => Type::where('group_code', 'post-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'categories' => PostCategory::orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'languages' => Language::orderBy('order_index')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        return Inertia::render('Admin/Post/Create', [
            'editData' => $post->loadCount('category')->load('images', 'files'),
            'types' => Type::where('group_code', 'post-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'categories' => PostCategory::orderBy('order_index')
                ->orderBy('name')
                ->get(),
            'languages' => Language::orderBy('order_index')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        // dd($request->all());
        $validated = $request->validate([
            'category_code' => 'nullable|string|max:255|exists:post_categories,code',
            'type_code' => 'nullable|string|max:255|exists:types,code',
            'language_code' => 'nullable|string|max:255|exists:languages,code',
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'keywords' => 'nullable|string|max:500',
            'status' => 'nullable|string|max:255',
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
                    'assets/images/posts',
                    600
                );

                $validated['thumbnail'] = $imageName;

                // delete old if replaced
                if ($imageName && $post->image) {
                    ImageHelper::deleteImage($post->image, 'assets/images/posts');
                }
            }

            $image_files = $request->file('images');
            unset($validated['images']);

            $item_files = $request->file('files');
            unset($validated['files']);

            // Update
            $post->update($validated);

            if ($image_files) {
                try {
                    foreach ($image_files as $image) {
                        $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/posts', 600);
                        PostImage::create([
                            'image' => $created_image_name,
                            'post_id' => $post->id,
                        ]);
                    }
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
                }
            }

            if ($item_files) {
                try {
                    foreach ($item_files as $item_file) {
                        $created_file_name = FileHelper::uploadFile($item_file, 'assets/files/posts', false);

                        if ($created_file_name) {
                            PostFile::create([
                                'file_name' => $created_file_name,
                                'file_type' => $item_file->getClientMimeType(),
                                'post_id' => $post->id,
                            ]);
                        }
                    }
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to upload files: ' . $e->getMessage());
                }
            }

            return redirect()->back()->with('success', 'Post updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Post: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $post = Post::withTrashed()->findOrFail($id); // 👈 include soft-deleted Post
        $post->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Post recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $post->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Post deleted successfully.');
    }

    public function destroy_image(PostImage $image)
    {
        // Debugging (Check if model is found)
        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        // Call helper function to delete image
        ImageHelper::deleteImage($image->image, 'assets/images/posts');

        // Delete from DB
        $image->delete();

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }
    public function destroy_file(PostFile $file)
    {
        // Debugging (Check if model is found)
        if (!$file) {
            return redirect()->back()->with('error', 'File not found.');
        }

        // Call helper function to delete image
        FileHelper::deleteFile($file->file_name, 'assets/files/posts');

        // Delete from DB
        $file->delete();

        return redirect()->back()->with('success', 'File deleted successfully.');
    }
}
