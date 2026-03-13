<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Type;
use App\Models\TypeGroup;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class TypeController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:type view', only: ['index', 'show']),
            new Middleware('permission:type create', only: ['create', 'store']),
            new Middleware('permission:type update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:type delete', only: ['destroy', 'destroy_image']),
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
        $group_code = $request->input('group_code'); // '', 'with', 'only'

        $query = Type::query();

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

        if ($group_code) {
            $query->where('group_code', $group_code);
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

        return Inertia::render('Admin/Type/Index', [
            'tableData' => $tableData,
            'typeGroups' => TypeGroup::orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Type/Create', [
            'typeGroups' => TypeGroup::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:types,code',
            'group_code' => 'required|string|exists:type_groups,code',
            'order_index' => 'required|numeric',
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
                    'assets/images/types',
                    600
                );
                $validated['image'] = $imageName;
            }

            // Create the type
            Type::create($validated);

            return redirect()->back()->with('success', 'Type created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create type: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Type $type)
    {
        return Inertia::render('Admin/Type/Create', [
            'typeGroups' => TypeGroup::orderBy('name')->get(),
            'editData' => $type,
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Type $type)
    {
        return Inertia::render('Admin/Type/Create', [
            'typeGroups' => TypeGroup::orderBy('name')->get(),
            'editData' => $type,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Type $type)
    {

        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:types,code,' . $type->id,
            'group_code' => 'required|string|exists:type_groups,code',
            'order_index' => 'required|numeric',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
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
                    'assets/images/types',
                    600
                );

                $validated['image'] = $imageName;

                // delete old if replaced
                if ($imageName && $type->image) {
                    ImageHelper::deleteImage($type->image, 'assets/images/types');
                }
            }

            // Update
            $type->update($validated);

            return redirect()->back()->with('success', 'Type updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update type: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $type = Type::withTrashed()->findOrFail($id); // 👈 include soft-deleted types
        $type->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Type recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Type $type)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $type->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Type deleted successfully.');
    }
}
