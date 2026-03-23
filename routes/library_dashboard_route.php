<?php

use App\Http\Controllers\Admin\CirculationController;
use App\Http\Controllers\Admin\CirculationRuleController;
use App\Http\Controllers\Admin\ItemCategoryController;
use App\Http\Controllers\Admin\ItemController;
use App\Http\Controllers\Admin\ItemDownloadsEngagementController;
use App\Http\Controllers\Admin\ItemMainCategoryController;
use App\Http\Controllers\Admin\ItemPhysicalCopyController;
use App\Http\Controllers\Admin\ItemReadsEngagementController;
use App\Http\Controllers\Admin\ItemTypeController;
use App\Http\Controllers\Admin\ItemViewsEngagementController;
use App\Http\Controllers\Admin\LibraryController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\TypeController;
use App\Http\Controllers\Admin\UserCategoryController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::prefix('dashboard/library/{library_code}')->group(function () {
        // Users & Categories
        Route::resource('users', UserController::class);
        Route::post('users/{user}/update', [UserController::class, 'update']);
        Route::post('users/{id}/recover', [UserController::class, 'recover']);

        Route::resource('user-categories', UserCategoryController::class);
        Route::post('user-categories/{user_category}/update', [UserCategoryController::class, 'update']);
        Route::post('user-categories/{id}/recover', [UserCategoryController::class, 'recover']);

        // Circulations
        Route::get('all-circulations', [CirculationController::class, 'all_circulations']);
        Route::delete('circulations/{circulation}', [CirculationController::class, 'destroy']);
        Route::post('circulations/{circulation}/recover', [CirculationController::class, 'recover']);
        Route::post('circulations/{circulation}/update-fine-status', [CirculationController::class, 'update_fine_status']);

        // Circulation Rules
        Route::resource('circulation-rules', CirculationRuleController::class);
        Route::post('circulation-rules/{circulation_rule}/update', [CirculationRuleController::class, 'update']);
        Route::post('circulation-rules/{id}/recover', [CirculationRuleController::class, 'recover']);

        // Items
        Route::resource('items', ItemController::class);
        Route::delete('items/images/{image}', [ItemController::class, 'destroy_image']);
        Route::delete('items/files/{file}', [ItemController::class, 'destroy_file']);
        Route::post('items/{item}/update', [ItemController::class, 'update']);
        Route::post('items/{id}/recover', [ItemController::class, 'recover']);

        // Physical Copies & Shelf Locations
        Route::get('items-physical-copies', [ItemPhysicalCopyController::class, 'index']);
        Route::get('items/{item_id}/physical-copies/create', [ItemPhysicalCopyController::class, 'create']);
        Route::post('items/{item_id}/physical-copies', [ItemPhysicalCopyController::class, 'store']);
        Route::get('items/{item_id}/physical-copies/{physical_copy_id}', [ItemPhysicalCopyController::class, 'show']);
        Route::get('items/{item_id}/physical-copies/{physical_copy_id}/edit', [ItemPhysicalCopyController::class, 'edit']);
        Route::post('items/{item_id}/physical-copies/{physical_copy_id}/update', [ItemPhysicalCopyController::class, 'update']);
        Route::post('items-physical-copies/{physical_copy_id}/recover', [ItemPhysicalCopyController::class, 'recover']);
        Route::delete('items/{item_id}/physical-copies/{physical_copy_barcode}', [ItemPhysicalCopyController::class, 'destroy']);

        // Taxonomy & Organization
        Route::resource('item-types', ItemTypeController::class);
        Route::post('item-types/{item_type}/update', [ItemTypeController::class, 'update']);
        Route::post('item-types/{id}/recover', [ItemTypeController::class, 'recover']);

        Route::resource('item-categories', ItemCategoryController::class);
        Route::post('item-categories/{item_category}/update', [ItemCategoryController::class, 'update']);
        Route::post('item-categories/{id}/recover', [ItemCategoryController::class, 'recover']);

        Route::resource('item-main-categories', ItemMainCategoryController::class);
        Route::post('item-main-categories/{item_main_category}/update', [ItemMainCategoryController::class, 'update']);
        Route::post('item-main-categories/{id}/recover', [ItemMainCategoryController::class, 'recover']);

        Route::resource('shelf-locations', LocationController::class); // Renamed to match Nav
        Route::post('shelf-locations/{location}/update', [LocationController::class, 'update']);
        Route::post('shelf-locations/{id}/recover', [LocationController::class, 'recover']);

        // Exports
        Route::get('circulations-export', [CirculationController::class, 'export_circulations']);
        Route::get('users-export', [UserController::class, 'export_users']);
        Route::get('items-export', [ItemController::class, 'export_items']);
        Route::get('item-physical-copies-export', [ItemPhysicalCopyController::class, 'export_item_physical_copies']);

        // Engagements & Analytics
        Route::get('item-views', [ItemViewsEngagementController::class, 'item_views']);
        Route::get('top-item-views', [ItemViewsEngagementController::class, 'top_item_views']);
        Route::get('item-reads', [ItemReadsEngagementController::class, 'item_reads']);
        Route::get('top-item-reads', [ItemReadsEngagementController::class, 'top_item_reads']);
        Route::get('item-downloads', [ItemDownloadsEngagementController::class, 'item_downloads']);
        Route::get('top-item-downloads', [ItemDownloadsEngagementController::class, 'top_item_downloads']);

        Route::get('top-item-views-summary-export', [ItemViewsEngagementController::class, 'export_top_item_views_summary']);
        Route::get('top-item-reads-summary-export', [ItemReadsEngagementController::class, 'export_top_items_summary']);
        Route::get('top-item-downloads-summary-export', [ItemDownloadsEngagementController::class, 'export_top_items_summary']);

        // Misc Settings
        Route::resource('libraries', LibraryController::class);
        Route::get('/edit-info', [LibraryController::class, 'edit_info']);
        Route::post('libraries/{library}/update', [LibraryController::class, 'update']);
        Route::post('libraries/{id}/recover', [LibraryController::class, 'recover']);

        Route::resource('types', TypeController::class);
        Route::post('types/{type}/update', [TypeController::class, 'update']);
        Route::post('types/{id}/recover', [TypeController::class, 'recover']);
    });
});
Route::get('/create-library', [LibraryController::class, 'create_library']);
