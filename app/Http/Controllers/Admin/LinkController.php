<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Link;
use App\Models\Type;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class LinkController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:link view', only: ['index', 'show']),
            new Middleware('permission:link create', only: ['create', 'store']),
            new Middleware('permission:link update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:link delete', only: ['destroy', 'destroy_image']),
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

        $query = Link::query();

        $query->with('created_user', 'updated_user');

        if ($type_code) {
            $query->where('type_code', $type_code);
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
                    ->orWhere('link', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/Link/Index', [
            'tableData' => $tableData,
            'types' => Type::where('group_code', 'link-type-group')->orderBy('order_index')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Link/Create', [
            'types' => Type::where('group_code', 'link-type-group')
                ->orderBy('order_index')
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
            'type_code' => 'nullable|string|max:255|exists:types,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'link' => 'required|string|max:255',
            'order_index' => 'required|numeric',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
        ]);

        try {
            // Add creator and updater
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            // Handle image upload if present
            if ($request->hasFile('image')) {
                $imageName = ImageHelper::uploadAndResizeImageWebp(
                    $request->file('image'),
                    'assets/images/links',
                    600
                );
                $validated['image'] = $imageName;
            }

            // Create the Link
            Link::create($validated);

            return redirect()->back()->with('success', 'Link created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Link: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Link $link)
    {
        return Inertia::render('Admin/Link/Create', [
            'editData' => $link,
            'readOnly' => true,
            'types' => Type::where('group_code', 'link-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Link $link)
    {
        return Inertia::render('Admin/Link/Create', [
            'editData' => $link,
            'types' => Type::where('group_code', 'link-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Link $link)
    {
        $validated = $request->validate([
            'type_code' => 'nullable|string|max:255|exists:types,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'link' => 'required|string|max:255',
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
                    'assets/images/links',
                    600
                );

                $validated['image'] = $imageName;

                // delete old if replaced
                if ($imageName && $link->image) {
                    ImageHelper::deleteImage($link->image, 'assets/images/links');
                }
            }

            // Update
            $link->update($validated);

            return redirect()->back()->with('success', 'Link updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Link: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $link = Link::withTrashed()->findOrFail($id); // 👈 include soft-deleted links
        $link->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Link recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Link $link)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $link->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Link deleted successfully.');
    }
}
