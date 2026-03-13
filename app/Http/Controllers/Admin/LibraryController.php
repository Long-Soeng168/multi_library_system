<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Library;
use App\Models\User;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LibraryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:library view', only: ['index', 'show']),
            new Middleware('permission:library create', only: ['create', 'store']),
            new Middleware('permission:library update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:library delete', only: ['destroy', 'destroy_image']),
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

        $query = Library::query();

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

        return Inertia::render('Admin/Library/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Library/Create', [
            'users' => User::where('library_id', null)->orderByDesc('id')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_index' => 'required|numeric',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
            'banner' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096', // Usually larger than thumbnail

            // Contact Info
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'website_url' => 'nullable|string|max:255',

            // Location
            'address' => 'nullable|string|max:500',
            'map_link' => 'nullable|string',

            // Operational
            'opening_hours' => 'nullable|string',
            'opening_days' => 'nullable|string',

            // Status & Ownership
            'status' => 'required|in:active,in_review,suspended,expired',
            'owner_id' => 'nullable|exists:users,id',
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
                    'assets/images/libraries',
                    600
                );
                $validated['image'] = $imageName;
            }

            if ($request->hasFile('banner')) {
                $bannerName = ImageHelper::uploadAndResizeImageWebp(
                    $request->file('banner'),
                    'assets/images/libraries',
                    600
                );
                $validated['banner'] = $bannerName;
            }

            // Start a transaction so both updates happen or neither does
            return DB::transaction(function () use ($validated) {
                // 1. Create the library
                $library = Library::create($validated);

                // 2. Assign Owner Role
                if (!empty($validated['owner_id'])) {
                    User::where('id', $validated['owner_id'])->update([
                        'library_id'   => $library->id,
                        'library_role' => 'Owner'
                    ]);
                }

                return redirect()->back()->with('success', 'Library created and owner assigned!');
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create library: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Library $library)
    {
        return Inertia::render('Admin/Library/Create', [
            'editData' => $library,
            'readOnly' => true,
            'users' => User::orderByDesc('id')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Library $library)
    {
        // dd($library);
        return Inertia::render('Admin/Library/Create', [
            'editData' => $library,
            'users' => User::where(function ($q) use ($library) {
                $q->whereNull('library_id')
                    ->orWhere('library_id', $library->id);
            })->orderByDesc('id')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Library $library)
    {

        $validated = $request->validate([
            // 'code' => 'required|string|max:255|unique:libraries,code,' . $library->id,
            'order_index' => 'required|numeric',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
            'banner' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096', // Usually larger than thumbnail

            // Contact Info
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'website_url' => 'nullable|string|max:255',

            // Location
            'address' => 'nullable|string|max:500',
            'map_link' => 'nullable|string',

            // Operational
            'opening_hours' => 'nullable|string',
            'opening_days' => 'nullable|string',

            // Status & Ownership
            'status' => 'required|in:active,in_review,suspended,expired',
            'owner_id' => 'nullable|exists:users,id',
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
                    'assets/images/libraries',
                    600
                );

                $validated['image'] = $imageName;

                // delete old if replaced
                if ($imageName && $library->image) {
                    ImageHelper::deleteImage($library->image, 'assets/images/libraries');
                }
            }

            $bannerFile = $request->file('banner');
            unset($validated['banner']);
            if ($bannerFile) {
                $bannerName = ImageHelper::uploadAndResizeImageWebp(
                    $bannerFile,
                    'assets/images/libraries',
                    1440,
                );

                $validated['banner'] = $bannerName;

                // delete old if replaced
                if ($bannerName && $library->banner) {
                    ImageHelper::deleteImage($library->banner, 'assets/images/libraries');
                }
            }

            // Update
            // 1. Check if the owner is actually changing
            if ($library->owner_id != $validated['owner_id']) {

                // 2. Remove roles from the PREVIOUS owner
                if ($library->owner_id) {
                    User::where('id', $library->owner_id)->update([
                        'library_id' => null,
                        'library_role' => null
                    ]);
                }

                // 3. Assign roles to the NEW owner
                if ($validated['owner_id']) {
                    User::where('id', $validated['owner_id'])->update([
                        'library_id' => $library->id,
                        'library_role' => 'Owner'
                    ]);
                }
            }

            // 4. Update the library record itself
            $library->update($validated);

            return redirect()->back()->with('success', 'Library updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update library: ' . $e->getMessage());
        }
    }


    public function recover($id)
    {
        $library = Library::withTrashed()->findOrFail($id); // 👈 include soft-deleted libraries
        $library->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Library recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Library $library)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $library->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Library deleted successfully.');
    }
}
