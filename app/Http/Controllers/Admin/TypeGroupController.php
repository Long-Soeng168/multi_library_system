<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\TypeGroup;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class TypeGroupController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:type_group view', only: ['index', 'show']),
            new Middleware('permission:type_group create', only: ['create', 'store']),
            new Middleware('permission:type_group update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:type_group delete', only: ['destroy', 'destroy_image']),
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
        $status = $request->input('status');
        $trashed = $request->input('trashed'); // '', 'with', 'only'

        $query = TypeGroup::query();

        $query->with('created_user', 'updated_user');

        // if ($status) {
        //     $query->where('status', $status);
        // }

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
                    ->orWhere('code', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/TypeGroup/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/TypeGroup/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:type_groups,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
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
                    'assets/images/type_groups',
                    600
                );
                $validated['image'] = $imageName;
            }

            // Create the type group
            TypeGroup::create($validated);

            return redirect()->back()->with('success', 'Type group created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create type group: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(TypeGroup $type_group)
    {
        return Inertia::render('Admin/TypeGroup/Create', [
            'editData' => $type_group,
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TypeGroup $type_group)
    {
        // dd($type_group->loadCount('types'));
        return Inertia::render('Admin/TypeGroup/Create', [
            'editData' => $type_group->loadCount('types'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TypeGroup $type_group)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:type_groups,code,' . $type_group->id,
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
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
                    'assets/images/type_groups',
                    600
                );

                $validated['image'] = $imageName;

                // delete old if replaced
                if ($imageName && $type_group->image) {
                    ImageHelper::deleteImage($type_group->image, 'assets/images/type_groups');
                }
            }

            // Update
            $type_group->update($validated);

            return redirect()->back()->with('success', 'Type group updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update type group: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $type_group = TypeGroup::withTrashed()->findOrFail($id); // 👈 include soft-deleted type_groups
        $type_group->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Type Group recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TypeGroup $type_group)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $type_group->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Type Group deleted successfully.');
    }
}
