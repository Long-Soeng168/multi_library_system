<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\WebsiteInfo;
use App\Models\Type;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class WebsiteInfoController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:website_info view', only: ['index', 'show']),
            new Middleware('permission:website_info create', only: ['create', 'store']),
            new Middleware('permission:website_info update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:website_info delete', only: ['destroy', 'destroy_image']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $website_info = WebsiteInfo::first();
        if ($website_info) {
            return redirect("/admin/website-infos/{$website_info->id}/edit");
        } else {
            return redirect("/admin/website-infos/create");
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/WebsiteInfo/Create',);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',

            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',

            'keywords' => 'nullable|string',
            'keywords_kh' => 'nullable|string',

            'address' => 'nullable|string|max:255',
            'address_kh' => 'nullable|string|max:255',

            'google_map_embed' => 'nullable|string|max:1000',

            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',

            'working_hours' => 'nullable|string|max:255',
            'working_hours_kh' => 'nullable|string|max:255',

            'working_days' => 'nullable|string|max:255',
            'working_days_kh' => 'nullable|string|max:255',

            'copyright' => 'nullable|string|max:255',
            'copyright_kh' => 'nullable|string|max:255',

            'logo' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
            'logo_darkmode' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',

            'primary_color' => 'nullable|string',
            'primary_foreground_color' => 'nullable|string',
        ]);

        try {
            // Handle normal logo upload
            if ($request->hasFile('logo')) {
                $logoName = ImageHelper::uploadAndResizeImageWebp(
                    $request->file('logo'),
                    'assets/images/website_infos',
                    600
                );
                $validated['logo'] = $logoName;
            }

            // Handle dark mode logo upload
            if ($request->hasFile('logo_darkmode')) {
                $darkLogoName = ImageHelper::uploadAndResizeImageWebp(
                    $request->file('logo_darkmode'),
                    'assets/images/website_infos',
                    600
                );
                $validated['logo_darkmode'] = $darkLogoName;
            }

            // Create the Website Info
            $website_info = WebsiteInfo::create($validated);

            return redirect("/admin/website-infos/{$website_info->id}/edit")->with('success', 'Website Info created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to create Website Info: ' . $e->getMessage());
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(WebsiteInfo $website_info)
    {
        return Inertia::render('Admin/WebsiteInfo/Create', [
            'editData' => $website_info,
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WebsiteInfo $website_info)
    {
        return Inertia::render('Admin/WebsiteInfo/Create', [
            'editData' => $website_info,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WebsiteInfo $website_info)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',

            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',

            'keywords' => 'nullable|string',
            'keywords_kh' => 'nullable|string',

            'address' => 'nullable|string|max:255',
            'address_kh' => 'nullable|string|max:255',

            'google_map_embed' => 'nullable|string|max:1000',

            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',

            'working_hours' => 'nullable|string|max:255',
            'working_hours_kh' => 'nullable|string|max:255',

            'working_days' => 'nullable|string|max:255',
            'working_days_kh' => 'nullable|string|max:255',

            'copyright' => 'nullable|string|max:255',
            'copyright_kh' => 'nullable|string|max:255',

            'logo' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',
            'logo_darkmode' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:4096',

            'primary_color' => 'nullable|string',
            'primary_foreground_color' => 'nullable|string',
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
                    'assets/images/website_infos',
                    600
                );

                // delete old logo if exists
                if ($website_info->logo) {
                    ImageHelper::deleteImage($website_info->logo, 'assets/images/website_infos');
                }

                $validated['logo'] = $logoName;
            }

            // Handle dark mode logo
            if ($darkLogoFile) {
                $darkLogoName = ImageHelper::uploadAndResizeImageWebp(
                    $darkLogoFile,
                    'assets/images/website_infos',
                    600
                );

                // delete old dark logo if exists
                if ($website_info->logo_darkmode) {
                    ImageHelper::deleteImage($website_info->logo_darkmode, 'assets/images/website_infos');
                }

                $validated['logo_darkmode'] = $darkLogoName;
            }

            // Update the Website Info
            $website_info->update($validated);

            return redirect()->back()->with('success', 'Website Info updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors('Failed to update Website Info: ' . $e->getMessage());
        }
    }



    public function recover($id)
    {
        $website_info = WebsiteInfo::withTrashed()->findOrFail($id); // 👈 include soft-deleted Website Info
        $website_info->restore(); // restores deleted_at to null
        return redirect()->back()->with('success', 'Website Info recovered successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WebsiteInfo $website_info)
    {
        // if ($user->image) {
        //     ImageHelper::deleteImage($user->image, 'assets/images/users');
        // }

        $website_info->delete(); // this will now just set deleted_at timestamp
        return redirect()->back()->with('success', 'Website Info deleted successfully.');
    }
}
