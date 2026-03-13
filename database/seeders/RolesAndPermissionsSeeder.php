<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {

        // // Heading
        // Permission::firstOrCreate(['name' => 'heading view']);
        // Permission::firstOrCreate(['name' => 'heading create']);
        // Permission::firstOrCreate(['name' => 'heading update']);
        // Permission::firstOrCreate(['name' => 'heading delete']);

        // // Link
        // Permission::firstOrCreate(['name' => 'link view']);
        // Permission::firstOrCreate(['name' => 'link create']);
        // Permission::firstOrCreate(['name' => 'link update']);
        // Permission::firstOrCreate(['name' => 'link delete']);

        // // Post
        // Permission::firstOrCreate(['name' => 'post view']);
        // Permission::firstOrCreate(['name' => 'post create']);
        // Permission::firstOrCreate(['name' => 'post update']);
        // Permission::firstOrCreate(['name' => 'post delete']);

        // // Post Category
        // Permission::firstOrCreate(['name' => 'post_category view']);
        // Permission::firstOrCreate(['name' => 'post_category create']);
        // Permission::firstOrCreate(['name' => 'post_category update']);
        // Permission::firstOrCreate(['name' => 'post_category delete']);

        // // Page
        // Permission::firstOrCreate(['name' => 'page view']);
        // Permission::firstOrCreate(['name' => 'page create']);
        // Permission::firstOrCreate(['name' => 'page update']);
        // Permission::firstOrCreate(['name' => 'page delete']);

        // // Banner
        // Permission::firstOrCreate(['name' => 'banner view']);
        // Permission::firstOrCreate(['name' => 'banner create']);
        // Permission::firstOrCreate(['name' => 'banner update']);
        // Permission::firstOrCreate(['name' => 'banner delete']);

        // // User
        // Permission::firstOrCreate(['name' => 'user view']);
        // Permission::firstOrCreate(['name' => 'user create']);
        // Permission::firstOrCreate(['name' => 'user update']);
        // Permission::firstOrCreate(['name' => 'user delete']);

        // // role
        // Permission::firstOrCreate(['name' => 'role view']);
        // Permission::firstOrCreate(['name' => 'role create']);
        // Permission::firstOrCreate(['name' => 'role update']);
        // Permission::firstOrCreate(['name' => 'role delete']);

        // // permission
        // Permission::firstOrCreate(['name' => 'permission view']);
        // Permission::firstOrCreate(['name' => 'permission create']);
        // Permission::firstOrCreate(['name' => 'permission update']);
        // Permission::firstOrCreate(['name' => 'permission delete']);

        // // Type
        // Permission::firstOrCreate(['name' => 'type_group view']);
        // Permission::firstOrCreate(['name' => 'type_group create']);
        // Permission::firstOrCreate(['name' => 'type_group update']);
        // Permission::firstOrCreate(['name' => 'type_group delete']);

        // // Type group
        // Permission::firstOrCreate(['name' => 'type view']);
        // Permission::firstOrCreate(['name' => 'type create']);
        // Permission::firstOrCreate(['name' => 'type update']);
        // Permission::firstOrCreate(['name' => 'type delete']);

        // // Key Value
        // Permission::firstOrCreate(['name' => 'key_value view']);
        // Permission::firstOrCreate(['name' => 'key_value create']);
        // Permission::firstOrCreate(['name' => 'key_value update']);
        // Permission::firstOrCreate(['name' => 'key_value delete']);

        // // FAQ
        // Permission::firstOrCreate(['name' => 'faq view']);
        // Permission::firstOrCreate(['name' => 'faq create']);
        // Permission::firstOrCreate(['name' => 'faq update']);
        // Permission::firstOrCreate(['name' => 'faq delete']);

        // // Language
        // Permission::firstOrCreate(['name' => 'language view']);
        // Permission::firstOrCreate(['name' => 'language create']);
        // Permission::firstOrCreate(['name' => 'language update']);
        // Permission::firstOrCreate(['name' => 'language delete']);

        // // Website Info
        // Permission::firstOrCreate(['name' => 'website_info view']);
        // Permission::firstOrCreate(['name' => 'website_info create']);
        // Permission::firstOrCreate(['name' => 'website_info update']);
        // Permission::firstOrCreate(['name' => 'website_info delete']);

        // // Library Data
        // Permission::firstOrCreate(['name' => 'library_data view']);
        // Permission::firstOrCreate(['name' => 'library_data create']);
        // Permission::firstOrCreate(['name' => 'library_data update']);
        // Permission::firstOrCreate(['name' => 'library_data delete']);

        // // File Manager
        // Permission::firstOrCreate(['name' => 'file_manager view']);
        // Permission::firstOrCreate(['name' => 'file_manager create']);
        // Permission::firstOrCreate(['name' => 'file_manager delete']);

        // // Item
        // Permission::firstOrCreate(['name' => 'item view']);
        // Permission::firstOrCreate(['name' => 'item create']);
        // Permission::firstOrCreate(['name' => 'item update']);
        // Permission::firstOrCreate(['name' => 'item delete']);

        // // Item Category
        // Permission::firstOrCreate(['name' => 'item_category view']);
        // Permission::firstOrCreate(['name' => 'item_category create']);
        // Permission::firstOrCreate(['name' => 'item_category update']);
        // Permission::firstOrCreate(['name' => 'item_category delete']);

        // // Message
        // Permission::firstOrCreate(['name' => 'message view']);
        // Permission::firstOrCreate(['name' => 'message create']);
        // Permission::firstOrCreate(['name' => 'message update']);
        // Permission::firstOrCreate(['name' => 'message delete']);

        // // Sample Content View
        // Permission::firstOrCreate(['name' => 'sample_content view']);

        // // Source Hub View
        // Permission::firstOrCreate(['name' => 'source_hub view']);

        // Location
        Permission::firstOrCreate(['name' => 'location view']);
        Permission::firstOrCreate(['name' => 'location create']);
        Permission::firstOrCreate(['name' => 'location update']);
        Permission::firstOrCreate(['name' => 'location delete']);

        // item_type
        Permission::firstOrCreate(['name' => 'item_type view']);
        Permission::firstOrCreate(['name' => 'item_type create']);
        Permission::firstOrCreate(['name' => 'item_type update']);
        Permission::firstOrCreate(['name' => 'item_type delete']);

        // Library
        Permission::firstOrCreate(['name' => 'library view']);
        Permission::firstOrCreate(['name' => 'library create']);
        Permission::firstOrCreate(['name' => 'library update']);
        Permission::firstOrCreate(['name' => 'library delete']);

        // User Category
        Permission::firstOrCreate(['name' => 'user_category view']);
        Permission::firstOrCreate(['name' => 'user_category create']);
        Permission::firstOrCreate(['name' => 'user_category update']);
        Permission::firstOrCreate(['name' => 'user_category delete']);

        // Circulation
        Permission::firstOrCreate(['name' => 'circulation view']);
        Permission::firstOrCreate(['name' => 'circulation create']);
        Permission::firstOrCreate(['name' => 'circulation update']);
        Permission::firstOrCreate(['name' => 'circulation delete']);

        // Create roles
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);
        // Give all existing permissions to the admin role
        $superAdminRole->syncPermissions(Permission::all());

        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $editorRole = Role::firstOrCreate(['name' => 'Editor']);
        $userRole = Role::firstOrCreate(['name' => 'User']);
    }
}
