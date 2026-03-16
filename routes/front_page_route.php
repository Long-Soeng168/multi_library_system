<?php

use App\Http\Controllers\FrontPage\FrontPageController;
use App\Http\Controllers\FrontPage\PostController;
use App\Http\Controllers\FrontPage\ResourceController;
use App\Models\Item;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [FrontPageController::class, 'index'])->name('home');
// Route::get('/', [ResourceController::class, 'index'])->name('home');

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);

Route::get('/resources', [ResourceController::class, 'index']); //e.g: /resources/theses, /resources/publicaitons
Route::get('/resources/{main_category_code}', [ResourceController::class, 'main_category']); //e.g: /resources/theses, /resources/publicaitons
Route::get('/resources/detail/{id}', [ResourceController::class, 'item_show']); //e.g: /resources/theses, /resources/publicaitons
Route::get('/theses/{id}', [ResourceController::class, 'item_show']); //e.g: /resources/theses, /resources/publicaitons


Route::get('/profile', function () {
    return Inertia::render('FrontPage/Profile/Index');
});

Route::get('/scan-qr', function () {
    return Inertia::render('FrontPage/ScanQR');
});
Route::get('/student-checkin', function () {
    return Inertia::render('FrontPage/StudentCheckin');
});


Route::get('/about', function () {
    return Inertia::render('FrontPage/About/Index');
});
Route::get('/support', function () {
    return Inertia::render('FrontPage/Support/Index');
});
Route::get('/pricing', function () {
    return Inertia::render('FrontPage/Pricing/Index');
});
Route::get('/products', function () {
    return Inertia::render('FrontPage/Products/Index');
});

Route::get('/our-journey', function () {
    return Inertia::render('FrontPage/About/OurJourney');
});
Route::get('/our-staffs', function () {
    return Inertia::render('FrontPage/About/OurStaffs');
});
Route::get('/our-staffs-structure', function () {
    return Inertia::render('FrontPage/About/OurStaffsStructure');
});


// $allowedSlugs = Category::whereIn('slug', ['theses', 'publications', 'audios', 'videos'])
//     ->pluck('slug')
//     ->toArray();

// Route::get('/{main_category}', function (Request $request, $main_category) {
//     return $main_category;
// })->whereIn('main_category', $allowedSlugs);

// Route::get('/{main_category}', function (Request $request, $main_category) {
//     return $main_category;
// })->whereIn('main_category', ['theses', 'publications', 'audios', 'videos']);




// REDIRECT OLD FILE VIEW
Route::get('/stream_pdf/thesis/{id}/{file_name}', function ($id, $file_name) {
    $showItem = Item::where('main_category_code', 'theses')
        ->where('old_id', $id)
        ->first(['id']);

    if (!$showItem) {
        abort(404);
    }

    return redirect()->to("/stream_pdf_file/items/{$showItem->id}/{$file_name}", 301);
});
Route::get('/stream_pdf/publication/{id}/{file_name}', function ($id, $file_name) {
    $showItem = Item::where('main_category_code', 'publications')
        ->where('old_id', $id)
        ->first(['id']);

    if (!$showItem) {
        abort(404);
    }

    return redirect()->to("/stream_pdf_file/items/{$showItem->id}/{$file_name}", 301);
});
Route::get('/stream_pdf/journals/{id}/{file_name}', function ($id, $file_name) {
    $showItem = Item::where('main_category_code', 'research-papers')
        ->where('old_id', $id)
        ->first(['id']);

    if (!$showItem) {
        abort(404);
    }

    return redirect()->to("/stream_pdf_file/items/{$showItem->id}/{$file_name}", 301);
});

// REDIRECT OLD ITEM VIEW
Route::get('/theses/{id}', function ($id) {
    $showItem = Item::where('main_category_code', 'theses')
        ->where('old_id', $id)
        ->first(['id']);

    if (!$showItem) {
        abort(404);
    }
    return redirect()->to("/resources/theses/{$showItem->id}", 301);
});
Route::get('/publications/{id}', function ($id) {
    $showItem = Item::where('main_category_code', 'publications')
        ->where('old_id', $id)
        ->first(['id']);

    if (!$showItem) {
        abort(404);
    }

    return redirect()->to("/resources/publications/{$showItem->id}", 301);
});
Route::get('/journals/{id}', function ($id) {
    $showItem = Item::where('main_category_code', 'research-papers')
        ->where('old_id', $id)
        ->first(['id']);

    if (!$showItem) {
        abort(404);
    }

    return redirect()->to("/resources/research-papers/{$showItem->id}", 301);
});
