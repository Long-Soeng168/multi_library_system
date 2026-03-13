<?php

use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    // Project Route
    Route::resource('api/file_manager/files', FileController::class);
    Route::resource('api/file_manager/folders', FolderController::class);
});
