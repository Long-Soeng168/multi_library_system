<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\ItemType;
use App\Models\Library;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ItemTypeController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // new Middleware('permission:item_type view', only: ['index', 'show']),
            // new Middleware('permission:item_type create', only: ['create', 'store']),
            // new Middleware('permission:item_type update', only: ['edit', 'update', 'recover']),
            // new Middleware('permission:item_type delete', only: ['destroy', 'destroy_image']),
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
        $status = $request->input('status');
        $trashed = $request->input('trashed'); // '', 'with', 'only'
        $library_id = $request->input('library_id', '');

        $query = ItemType::query();

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

        $query->with('created_user', 'updated_user', 'library');

        if ($library_id) {
            $query->where('library_id', $library_id);
        }

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

        return Inertia::render('Admin/ItemType/Index', [
            'tableData' => $tableData,
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/ItemType/Create', [
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
            'order_index' => 'required|numeric',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'is_checkable' => 'required|boolean',
            'image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
        ]);


        try {
            $validated['code'] = (string) Str::uuid();
            // Add creator and updater
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            // Handle image upload if present
            if ($request->hasFile('image')) {
                $imageName = ImageHelper::uploadAndResizeImageWebp(
                    $request->file('image'),
                    'assets/images/item_types',
                    600
                );
                $validated['image'] = $imageName;
            }

            // Create the type
            ItemType::create($validated);

            return redirect()->back()->with('success', 'Type created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create type: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Request $request, $param1, $param2 = null)
    {
        if ($param2) {
            $library_code = $param1;
            $item_type_id = $param2;
        } else {
            $library_code = null;
            $item_type_id = $param1;
        }
        $item_type = ItemType::findOrFail($item_type_id);

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

        return Inertia::render('Admin/ItemType/Create', [
            'editData' => $item_type,
            'readOnly' => true,
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
            $item_type_id = $param2;
        } else {
            $library_code = null;
            $item_type_id = $param1;
        }
        $item_type = ItemType::findOrFail($item_type_id);

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

        return Inertia::render('Admin/ItemType/Create', [
            'editData' => $item_type,
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ItemType $item_type)
    {

        $validated = $request->validate([
            'library_id' => 'nullable|integer|exists:libraries,id',
            'order_index' => 'required|numeric',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'is_checkable' => 'required|boolean',
            'image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
        ]);
        // dd($request->all());


        try {
            // track updater
            $validated['updated_by'] = $request->user()->id;

            $imageFile = $request->file('image');
            unset($validated['image']);

            // Handle image upload if present
            if ($imageFile) {
                $imageName = ImageHelper::uploadAndResizeImageWebp(
                    $imageFile,
                    'assets/images/item_types',
                    600
                );

                $validated['image'] = $imageName;

                // delete old if replaced
                if ($imageName && $item_type->image) {
                    ImageHelper::deleteImage($item_type->image, 'assets/images/item_types');
                }
            }

            // Update
            $item_type->update($validated);

            return redirect()->back()->with('success', 'Type updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update type: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $item_type = ItemType::withTrashed()->findOrFail($id); // 👈 include soft-deleted item_types
        $item_type->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Type recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItemType $item_type)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $item_type->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Type deleted successfully.');
    }
}
