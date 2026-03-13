<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Type;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class LanguageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:language view', only: ['index', 'show']),
            new Middleware('permission:language create', only: ['create', 'store']),
            new Middleware('permission:language update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:language delete', only: ['destroy', 'destroy_image']),
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

        $query = Language::query();

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
                    ->orWhere('id', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/Language/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Language/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:languages,code,',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'required|numeric',
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
                    'assets/images/languages',
                    600
                );
                $validated['image'] = $imageName;
            }

            // Create the Language
            Language::create($validated);

            return redirect()->back()->with('success', 'Language created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Language: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Language $language)
    {
        return Inertia::render('Admin/Language/Create', [
            'editData' => $language,
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Language $language)
    {
        return Inertia::render('Admin/Language/Create', [
            'editData' => $language,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Language $language)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:languages,code,' . $language->id,
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'required|numeric',
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
                    'assets/images/languages',
                    600
                );

                $validated['image'] = $imageName;

                // delete old if replaced
                if ($imageName && $language->image) {
                    ImageHelper::deleteImage($language->image, 'assets/images/languages');
                }
            }

            // Update
            $language->update($validated);

            return redirect()->back()->with('success', 'Language updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Language: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $language = Language::withTrashed()->findOrFail($id); // 👈 include soft-deleted Language
        $language->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Language recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Language $language)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $language->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Language deleted successfully.');
    }
}
