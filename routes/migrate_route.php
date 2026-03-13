<?php

use App\Helpers\ImageHelper;
use App\Models\Item;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

Route::get('/migrate_journals_to_items', function () {
    // set_time_limit(0);

    // DB::table('journals')
    //     ->orderBy('id')
    //     ->chunk(100, function ($journals) {

    //         foreach ($journals as $journal) {

    //             $item = Item::create(
    //                 [
    //                     'old_id' => $journal->id,
    //                     'name' => $journal->name,
    //                     'long_description' => $journal->description,
    //                     'published_year' => $journal->published_date,
    //                     'total_page' => $journal->pages_count,
    //                     'file_name' => $journal->pdf,
    //                     'thumbnail' => $journal->image,
    //                     'total_read_count' => $journal->read_count ?? 0,
    //                     'total_download_count' => $journal->download_count ?? 0,

    //                     'publisher_id' => $journal->publisher_id,
    //                     'language_code' => $journal->language_id,

    //                     'main_category_code' => 'research-paper',
    //                     'file_type_code' => 'pdf-file',
    //                     'status' => 'published',

    //                     'created_at' => $journal->created_at,
    //                     'updated_at' => $journal->updated_at,
    //                 ]
    //             );

    //             if ($journal->author_id) {
    //                 $item->authors()->sync([(int) $journal->author_id]);
    //             }
    //         }
    //     });

    // return 'Success.';
});

Route::get('/migrate_publications_to_items', function () {
    // set_time_limit(0);

    // DB::table('publications')
    //     ->orderBy('id')
    //     ->chunk(100, function ($publications) {

    //         foreach ($publications as $pub) {

    //             $item = Item::create(
    //                 [
    //                     'old_id' => $pub->id,
    //                     'name' => $pub->name,
    //                     'long_description' => $pub->description,
    //                     'published_year' => $pub->year,
    //                     'total_page' => $pub->pages_count,
    //                     'file_name' => $pub->pdf,
    //                     'thumbnail' => $pub->image,
    //                     'total_read_count' => $pub->read_count ?? 0,
    //                     'total_download_count' => $pub->download_count ?? 0,

    //                     'publisher_id' => $pub->publisher_id,
    //                     'language_code' => $pub->language_id,
    //                     'category_code' => $pub->publication_sub_category_id
    //                         ? (int) $pub->publication_sub_category_id
    //                         : ($pub->publication_category_id ? (int) $pub->publication_category_id : null),


    //                     'main_category_code' => 'publication',
    //                     'file_type_code' => 'pdf-file',
    //                     'status' => 'published',

    //                     'created_at' => $pub->created_at,
    //                     'updated_at' => $pub->updated_at,
    //                 ]
    //             );

    //             if ($pub->author_id) {
    //                 $item->authors()->sync([(int) $pub->author_id]);
    //             }
    //         }
    //     });

    // return 'Success.';
});


Route::get('/migrate_theses_to_items', function () {
    // set_time_limit(0);

    // DB::table('theses_full')
    //     ->orderBy('id')
    //     ->chunk(100, function ($theses) {
    //         foreach ($theses as $thesis) {
    //             Item::create(
    //                 [
    //                     'old_id' => $thesis->id,
    //                     'name' => $thesis->name,
    //                     'long_description' => $thesis->description,
    //                     'published_year' => $thesis->year,
    //                     'total_page' => $thesis->pages_count,
    //                     'file_name' => $thesis->pdf,
    //                     'thumbnail' => $thesis->image,
    //                     'total_read_count' => $thesis->read_count ?? 0,
    //                     'total_download_count' => $thesis->download_count ?? 0,

    //                     'category_code' => $thesis->major_id,
    //                     'language_code' => $thesis->language_id,
    //                     'advisor_id' => $thesis->supervisor_id,
    //                     'author_name' => preg_replace('/\s*\/\s*/', ' - ', $thesis->student_name),
    //                     'institution' => $thesis->institution,
    //                     'batch' => $thesis->generation,

    //                     'main_category_code' => 'thesis',
    //                     'file_type_code' => 'pdf-file',
    //                     'status' => 'published',

    //                     'created_at' => $thesis->created_at,
    //                     'updated_at' => $thesis->updated_at,
    //                 ]
    //             );
    //         }
    //     });

    // return 'Success.';
});

Route::get('/migrate_category', function () {
    // set_time_limit(0);

    // $oldCates = DB::table('old_publication_sub_categories')
    //     ->select('id', 'name', 'order_index', 'publication_category_id')
    //     ->get();

    // foreach ($oldCates as $oldCate) {
    //     $parent = ItemCategory::where('code', $oldCate->publication_category_id)->first();
    //     if (!$parent) continue;
    //     ItemCategory::firstOrCreate(
    //         ['code' => $oldCate->id],
    //         [
    //             'name' => $oldCate->name,
    //             'parent_id' => $parent->id,
    //             'order_index' => $oldCate->order_index ?? 1000,
    //             'item_main_category_code' => 'publication',
    //         ]
    //     );
    // }

    // return 'Success';
});

Route::get('/migrate_users', function () {
    // set_time_limit(0);

    // $oldUsers = DB::table('old_advisor_users')
    //     ->select('id', 'name')
    //     ->get();

    // foreach ($oldUsers as $oldUser) {

    //     $email = 'user_' . $oldUser->id . '@email.com';

    //     $user = User::firstOrCreate(
    //         ['id' => $oldUser->id],
    //         [
    //             'name' => $oldUser->name,
    //             'email' => $email,
    //             'password' => Hash::make($email),
    //         ]
    //     );

    //     if (! $user->hasRole('Advisor')) {
    //         $user->assignRole('Advisor');
    //     }
    // }

    // return 'Success';
});


use Illuminate\Support\Facades\File;
use Illuminate\Http\UploadedFile;

Route::get('/compress_images_to_webp/{start}/{end}', function ($start, $end) {
    set_time_limit(0);

    $items = Item::whereBetween('id', [(int)$start, (int)$end])
        ->orderBy('id')
        ->get();

    $oldFolder = public_path('assets/images/before_compress_items');
    $newFolder = 'assets/images/items';

    // Ensure new folder exists
    if (!File::exists(public_path($newFolder))) {
        File::makeDirectory(public_path($newFolder), 0755, true, true);
    }

    $failedItemIds = [];

    foreach ($items as $item) {
        if (!$item->thumbnail) {
            $failedItemIds[] = $item->id;
            continue;
        }

        $oldImagePath = $oldFolder . '/' . $item->thumbnail;

        if (!File::exists($oldImagePath)) {
            $failedItemIds[] = $item->id;
            continue;
        }

        try {
            // Wrap disk file as UploadedFile so your helper can use it
            $uploadedFile = new UploadedFile(
                $oldImagePath,
                $item->thumbnail,
                File::mimeType($oldImagePath),
                null,
                true // mark as test file (prevents move issues)
            );

            // Call your helper
            $newFileName = ImageHelper::uploadAndResizeImageWebp(
                $uploadedFile,
                $newFolder,
                600,
                false
            );

            $newFilePath = public_path($newFolder . '/' . $newFileName);

            // if ($newFileName && File::exists($newFilePath)) {
            if ($newFileName) {
                $item->update(['thumbnail' => $newFileName]);
            } else {
                $failedItemIds[] = $item->id;
            }
        } catch (\Throwable $e) {
            $failedItemIds[] = $item->id;
        }
    }

    return response()->json([
        'status' => 'done',
        'failed_ids' => $failedItemIds,
        'failed_count' => count($failedItemIds),
    ]);
});
