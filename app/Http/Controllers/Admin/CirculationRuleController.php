<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\CirculationRule;
use App\Models\Library;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class CirculationRuleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // new Middleware('permission:circulation view', only: ['index', 'show']),
            // new Middleware('permission:circulation create', only: ['create', 'store']),
            // new Middleware('permission:circulation update', only: ['edit', 'update', 'recover']),
            // new Middleware('permission:circulation delete', only: ['destroy', 'destroy_image']),
        ];
    }

    public function index(Request $request, $library_code = null)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $library_id = $request->input('library_id');
        $trashed = $request->input('trashed'); // '', 'with', 'only'

        $query = CirculationRule::query();

        $user = $request->user();
        $isLibraryStaff = false;
        $hasGlobalPermission = $user->hasAnyPermission(['item view']);
        if ($library_code) {
            $currentUsedLibrary = Library::where('code', $library_code)->firstOrFail();
            $isLibraryStaff = ($user->library_id === $currentUsedLibrary->id) &&
                in_array($user->library_role, ['Owner', 'Staff']);
        }
        if ($isLibraryStaff) {
            $circulation_rule = CirculationRule::where('library_id', $currentUsedLibrary?->id)->first();
            if ($circulation_rule) {
                return redirect("/dashboard/library/{$currentUsedLibrary?->code}/circulation-rules/{$circulation_rule->id}/edit");
            } else {
                return redirect("/dashboard/library/{$currentUsedLibrary?->code}/circulation-rules/create");
            }
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
                return $sub_query->where('library_id', 'LIKE', "%{$search}%")
                    ->orWhere('fine_amount_per_day', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $tableData = $query->paginate($perPage)->onEachSide(1);

        return Inertia::render('Admin/CirculationRule/Index', [
            'tableData' => $tableData,
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }
    // public function index(Request $request)
    // {
    //     $circulation_rule = CirculationRule::first();
    //     if ($circulation_rule) {
    //         return redirect("/admin/circulation-rules/{$circulation_rule->id}/edit");
    //     } else {
    //         return redirect("/admin/circulation-rules/create");
    //     }
    // }

    public function create()
    {
        return Inertia::render('Admin/CirculationRule/Create', [
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fine_amount_per_day' => 'required|numeric|min:0|max:999999.99',
            'max_fines_amount' => 'required|numeric|min:0|max:999999.99',
            'borrowing_limit' => 'required|integer|min:0|max:1000',
            'loan_period' => 'required|integer|min:1|max:365',
            'library_id' => 'nullable|integer|exists:libraries,id',
        ]);

        try {

            $circulation_rule = CirculationRule::create($validated);

            return redirect("/admin/circulation-rules/{$circulation_rule->id}/edit")->with('success', 'Circulation Rule created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Circulation Rule: ' . $e->getMessage());
        }
    }

    public function show(CirculationRule $circulation_rule)
    {
        return Inertia::render('Admin/CirculationRule/Create', [
            'editData' => $circulation_rule,
            'readOnly' => true,
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    public function edit(Request $request, $param1, $param2 = null)
    {
        if ($param2) {
            $library_code = $param1;
            $rule_id = $param2;
        } else {
            $library_code = null;
            $rule_id = $param1;
        }
        $circulation_rule = CirculationRule::findOrFail($rule_id);

        $user = $request->user();
        $isLibraryStaff = false;
        $hasGlobalPermission = $user->hasAnyPermission(['item view']);
        if ($library_code) {
            $currentUsedLibrary = Library::where('code', $library_code)->firstOrFail();
            $isLibraryStaff = ($user->library_id === $currentUsedLibrary->id) &&
                in_array($user->library_role, ['Owner', 'Staff']);
        }
        if ($isLibraryStaff) {
            if ($circulation_rule->library_id != $user->library_id) {
                abort(403, 'You do not have permission to view this.');
            }
        } else if ($hasGlobalPermission) {
            // ...
        } else {
            abort(403, 'You do not have permission to view this.');
        }
        return Inertia::render('Admin/CirculationRule/Create', [
            'editData' => $circulation_rule,
            'libraries' => Library::orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, CirculationRule $circulation_rule)
    {
        $validated = $request->validate([
            'fine_amount_per_day' => 'required|numeric|min:0|max:999999.99',
            'max_fines_amount' => 'required|numeric|min:0|max:999999.99',
            'borrowing_limit' => 'required|integer|min:0|max:1000',
            'loan_period' => 'required|integer|min:1|max:365',
            'library_id' => 'nullable|integer|exists:libraries,id',
        ]);

        try {
            // separate file handling for logos
            $logoFile = $request->file('logo');
            $darkLogoFile = $request->file('logo_darkmode');

            unset($validated['logo'], $validated['logo_darkmode']);

            // Handle normal logo
            if ($logoFile) {
                $logoName = ImageHelper::uploadAndResizeImageWebp(
                    $logoFile,
                    'assets/images/circulation_rules',
                    600
                );

                // delete old logo if exists
                if ($circulation_rule->logo) {
                    ImageHelper::deleteImage($circulation_rule->logo, 'assets/images/circulation_rules');
                }

                $validated['logo'] = $logoName;
            }

            // Handle dark mode logo
            if ($darkLogoFile) {
                $darkLogoName = ImageHelper::uploadAndResizeImageWebp(
                    $darkLogoFile,
                    'assets/images/circulation_rules',
                    600
                );

                // delete old dark logo if exists
                if ($circulation_rule->logo_darkmode) {
                    ImageHelper::deleteImage($circulation_rule->logo_darkmode, 'assets/images/circulation_rules');
                }

                $validated['logo_darkmode'] = $darkLogoName;
            }

            // Update the Circulation Rule
            $circulation_rule->update($validated);

            return redirect()->back()->with('success', 'Circulation Rule updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Circulation Rule: ' . $e->getMessage());
        }
    }



    public function recover($id)
    {
        $circulation_rule = CirculationRule::withTrashed()->findOrFail($id); // 👈 include soft-deleted Circulation Rule
        $circulation_rule->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Circulation Rule recovered successfully.');
    }

    public function destroy(CirculationRule $circulation_rule)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $circulation_rule->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Circulation Rule deleted successfully.');
    }
}
