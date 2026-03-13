<?php

use App\Http\Controllers\FileCheckController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

// ==== Default Routes ====
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/file_manager.php';

// ==== Main Routes ====
require __DIR__ . '/library_dashboard_route.php';
require __DIR__ . '/admin_route.php';
require __DIR__ . '/front_page_route.php';
require __DIR__ . '/file_stream_route.php';


// ==== Plugin App ====
Route::get('/barcode-generator', function () {
    return Inertia::render('plugins/BarcodeGenerator/BarcodeGenerator');
});
Route::get('/qr-code-generator', function () {
    return Inertia::render('plugins/QRCodeGenerator/QRCodeGenerator');
});

// ==== Other Routes ====

// Test Error
Route::get('/test_error', function () {
    abort('503', 'hi');
});

// Switch Language
Route::get('/lang/{locale}', function ($locale) {
    if (!in_array($locale, ['en', 'kh'])) {
        abort(404);
    }
    Session::put('locale', $locale);
    return redirect()->back();
});



// ==== Functions Migrate Data ====
// require __DIR__ . '/migrate_route.php';


// routes/web.php or api.php
// Route::get('/check_exist_files', [FileCheckController::class, 'check_items_files']);
// Route::get('/check_items_images', [FileCheckController::class, 'check_items_images']);
