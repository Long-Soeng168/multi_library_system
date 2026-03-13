<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\KeyValue;
use App\Models\Type;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class KeyValueController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:key_value view', only: ['index', 'show']),
            new Middleware('permission:key_value create', only: ['create', 'store']),
            new Middleware('permission:key_value update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:key_value delete', only: ['destroy', 'destroy_image']),
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

        $query = KeyValue::query();

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
                    ->orWhere('value', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/KeyValue/Index', [
            'tableData' => $tableData,
            'types' => Type::where('group_code', 'key-value-type-group')->orderBy('order_index')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/KeyValue/Create', [
            'types' => Type::where('group_code', 'key-value-type-group')
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
        $validated = $request->validate([
            'type_code' => 'nullable|string|max:255|exists:types,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'value' => 'required|string|max:255',
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
                    'assets/images/key_values',
                    600
                );
                $validated['image'] = $imageName;
            }

            // Create the Key Value
            KeyValue::create($validated);

            return redirect()->back()->with('success', 'Key Value created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Key Value: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(KeyValue $key_value)
    {
        return Inertia::render('Admin/KeyValue/Create', [
            'editData' => $key_value,
            'readOnly' => true,
            'types' => Type::where('group_code', 'key-value-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(KeyValue $key_value)
    {
        return Inertia::render('Admin/KeyValue/Create', [
            'editData' => $key_value,
            'types' => Type::where('group_code', 'key-value-type-group')
                ->orderBy('order_index')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, KeyValue $key_value)
    {
        $validated = $request->validate([
            'type_code' => 'nullable|string|max:255|exists:types,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'value' => 'required|string|max:255',
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
                    'assets/images/key_values',
                    600
                );

                $validated['image'] = $imageName;

                // delete old if replaced
                if ($imageName && $key_value->image) {
                    ImageHelper::deleteImage($key_value->image, 'assets/images/key_values');
                }
            }

            // Update
            $key_value->update($validated);

            return redirect()->back()->with('success', 'Key Value updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Key Value: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $key_value = KeyValue::withTrashed()->findOrFail($id); // 👈 include soft-deleted Key Value
        $key_value->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Key Value recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KeyValue $key_value)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $key_value->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Key Value deleted successfully.');
    }
}
