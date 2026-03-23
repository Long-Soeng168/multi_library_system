<?php

namespace App\Http\Controllers\Admin;

use App\Exports\UserExport;
use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Circulation;
use App\Models\Library;
use App\Models\Type;
use App\Models\User;
use App\Models\UserCategory;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // new Middleware('permission:user view', only: ['index', 'show']),
            // new Middleware('permission:user create', only: ['create', 'store']),
            // new Middleware('permission:user update', only: ['edit', 'update', 'recover']),
            // new Middleware('permission:user delete', only: ['destroy', 'destroy_image']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $library_code = null)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $library_id = $request->input('library_id', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');
        $role = $request->input('role');       // filter by role
        $trashed = $request->input('trashed'); // '', 'with', 'only'

        $query = User::query();

        $user = $request->user();
        $isLibraryStaff = false;
        $hasGlobalPermission = $user->hasAnyPermission(['user view']);
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

        $query->with('created_user', 'updated_user', 'roles', 'title', 'library');

        // if ($status) {
        //     $query->where('status', $status);
        // }

        // Filter by Spatie role
        if ($role) {
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
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
                    ->orWhere('card_number', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');
        $query->withCount('author_items', 'publisher_items', 'advisor_items', 'posts');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/Users/Index', [
            'tableData' => $tableData,
            'roles' => Role::when($library_id, function ($query) use ($library_id) {
                $query->whereIn('name', ['Author', 'Publisher']);
            })->orderBy('id')->get(),
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, $library_code = null)
    {
        $library_id = $request->input('library_id', '');

        $auht_user = $request->user();
        $isLibraryStaff = false;
        $hasGlobalPermission = $auht_user->hasAnyPermission(['user view']);
        if ($library_code) {
            $currentUsedLibrary = Library::where('code', $library_code)->firstOrFail();
            $isLibraryStaff = ($auht_user->library_id === $currentUsedLibrary->id) &&
                in_array($auht_user->library_role, ['Owner', 'Staff']);
        }
        if ($isLibraryStaff) {
            $library_id = $currentUsedLibrary?->id;
        } else if ($hasGlobalPermission) {
            // ...
        } else {
            abort(403, 'You do not have permission to view this.');
        }

        return Inertia::render('Admin/Users/Create', [
            'types' => Type::where('group_code', 'user-title-type-group')->orderBy('order_index')->orderBy('name')->get(),
            'userCategories' => UserCategory::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('order_index')->orderBy('name')->get(),
            'roles' => Role::when($library_id, function ($query) use ($library_id) {
                $query->whereIn('name', ['Author', 'Publisher']);
            })->orderBy('id')->get(),
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
            'library_role' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            // 'card_number' => 'nullable|string|max:255|unique:users,card_number',
            'card_number' => [
                'nullable',
                'string',
                Rule::unique('users')
                    ->where(fn($query) => $query->where('library_id', $request->library_id))
            ],
            'expired_at' => 'nullable|date|date_format:Y-m-d|after_or_equal:today',
            'title_type_code' => 'nullable|string|max:255|exists:types,code',
            'category_code' => 'nullable|string|max:255|exists:user_categories,code',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|max:255|confirmed', // Laravel auto-validates against confirm_password
            'phone' => 'nullable|numeric|digits_between:8,15|unique:users,phone',
            'gender' => 'nullable|string|in:male,female,other',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:4096',
            'roles' => 'nullable|array'
        ]);
        // dd($validated );
        $userCategory = UserCategory::where('code', $request->category_code)->first();

        if (empty($validated['expired_at']) && $userCategory && $userCategory->enrollment_period_months) {
            $validated['expired_at'] = now()
                ->addMonths($userCategory->enrollment_period_months)
                ->format('Y-m-d');
        }

        try {
            // Add creator and updater
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            // Hash the password
            $validated['password'] = Hash::make($validated['password']);

            // Extract and unset non-model fields
            $roles = $request->input('roles', []);
            $imageFile = $request->file('image');
            unset($validated['image']);

            // Handle image upload if present
            if ($imageFile) {
                $imageName = ImageHelper::uploadAndResizeImageWebp($imageFile, 'assets/images/users', 600);
                $validated['image'] = $imageName;
            }

            // Create the user
            $user = User::create($validated);

            // Assign roles
            if (!empty($roles)) {
                $user->syncRoles($roles);
            } else {
                // $user->syncRoles('User');
            }

            return redirect()->back()->with('success', 'User create successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create user: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Request $request, $param1, $param2 = null)
    {
        if ($param2) {
            $library_code = $param1;
            $user_id = $param2;
        } else {
            $library_code = null;
            $user_id = $param1;
        }
        $user = User::findOrFail($user_id);
        $library_id = $request->input('library_id', '');

        $auht_user = $request->user();
        $isLibraryStaff = false;
        $hasGlobalPermission = $auht_user->hasAnyPermission(['user view']);
        if ($library_code) {
            $currentUsedLibrary = Library::where('code', $library_code)->firstOrFail();
            $isLibraryStaff = ($auht_user->library_id === $currentUsedLibrary->id) &&
                in_array($auht_user->library_role, ['Owner', 'Staff']);
        }
        if ($isLibraryStaff) {
            $library_id = $currentUsedLibrary?->id;
        } else if ($hasGlobalPermission) {
            // ...
        } else {
            abort(403, 'You do not have permission to view this.');
        }
        $userData = $user->load('roles');
        $userCirculations = Circulation::where('borrower_id', $user->id)
            ->orderByDesc('borrowed_at')
            ->with('item_physical_copy:id,item_id,barcode,item_type_code,home_library_code,current_library_code', 'item_physical_copy.item:id,name', 'item_physical_copy.item_type:id,code,name,name_kh')
            ->get();
        // return $userCirculations;
        return Inertia::render('Admin/Users/Show', [
            'userData' => $userData,
            'userCirculations' => $userCirculations,
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
            $user_id = $param2;
        } else {
            $library_code = null;
            $user_id = $param1;
        }
        $user = User::findOrFail($user_id);
        $library_id = $request->input('library_id', '');

        $auht_user = $request->user();
        $isLibraryStaff = false;
        $hasGlobalPermission = $auht_user->hasAnyPermission(['user view']);
        if ($library_code) {
            $currentUsedLibrary = Library::where('code', $library_code)->firstOrFail();
            $isLibraryStaff = ($auht_user->library_id === $currentUsedLibrary->id) &&
                in_array($auht_user->library_role, ['Owner', 'Staff']);
        }
        if ($isLibraryStaff) {
            $library_id = $currentUsedLibrary?->id;
        } else if ($hasGlobalPermission) {
            // ...
        } else {
            abort(403, 'You do not have permission to view this.');
        }

        return Inertia::render('Admin/Users/Create', [
            'editData' => $user->load('roles'),
            'types' => Type::where('group_code', 'user-title-type-group')->orderBy('order_index')->orderBy('name')->get(),
            'userCategories' => UserCategory::when($library_id, function ($query) use ($library_id) {
                $query->where('library_id', $library_id);
            })->orderBy('order_index')->orderBy('name')->get(),
            'roles' => Role::when($library_id, function ($query) use ($library_id) {
                $query->whereIn('name', ['Author', 'Publisher']);
            })->orderBy('id')->get(),
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'library_id' => 'nullable|integer|exists:libraries,id',
            'library_role' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            // 'card_number' => 'nullable|string|max:255|unique:users,card_number,'  . $user->id,
            'card_number' => [
                'nullable',
                'string',
                Rule::unique('users')
                    ->where(fn($query) => $query->where('library_id', $request->library_id))
                    ->ignore($user->id)
            ],
            'expired_at' => 'nullable|date|date_format:Y-m-d',
            'title_type_code' => 'nullable|string|max:255|exists:types,code',
            'category_code' => 'nullable|string|max:255|exists:user_categories,code',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|max:255|confirmed', // Laravel auto-validates against confirm_password
            'phone' => 'nullable|numeric|digits_between:8,15|unique:users,phone,' . $user->id,
            'gender' => 'nullable|string|in:male,female,other',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:4096',
            'roles' => 'nullable|array'
        ]);

        try {
            // Add updater
            $validated['updated_by'] = $request->user()->id;

            // Hash the password
            if (!empty($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            // Extract and unset non-model fields
            $roles = $request->input('roles', []);
            $imageFile = $request->file('image');
            unset($validated['image']);

            // Handle image upload if present
            if ($imageFile) {
                $imageName = ImageHelper::uploadAndResizeImageWebp($imageFile, 'assets/images/users', 600);
                $validated['image'] = $imageName;
                if ($imageName && $user->image) {
                    ImageHelper::deleteImage($user->image, 'assets/images/users');
                }
            }

            // Create the user
            $user->update($validated);

            // Assign roles
            if (!empty($roles)) {
                $user->syncRoles($roles);
            } else {
                $user->syncRoles([]);
            }

            return redirect()->back()->with('success', 'User created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create user: ' . $e->getMessage());
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function recover($id)
    {
        $user = User::withTrashed()->findOrFail($id); // 👈 include soft-deleted users
        $user->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'User recovered successfully.');
    }


    public function destroy(User $user)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $user->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    // EXPORT
    public function export_users(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $role = $request->input('role');
        $trashed = $request->input('trashed');

        $query = User::query()->with('created_user', 'updated_user', 'roles', 'title');

        if ($role) {
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }

        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%")
                    ->orWhere('card_number', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $rows = $query->orderBy($sortBy, $sortDirection)->get();

        return Excel::download(new UserExport($rows), 'users.xlsx');
    }
}
