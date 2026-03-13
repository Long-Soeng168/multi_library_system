<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Support\Facades\File;

class FileCheckController extends Controller
{
    public function check_items_files()
    {
        $missingFiles = [];

        $items = Item::whereNotNull('file_name')
            // ->limit(10)
            ->get(['id', 'file_name']);

        foreach ($items as $item) {
            $path = public_path('assets/files/items/' . $item->file_name);

            if (!File::exists($path)) {
                $missingFiles[] = [
                    'item_id' => $item->id,
                    'file_name' => $item->file_name,
                    'expected_path' => $path,
                ];
            }
        }

        return response()->json([
            'missing_count' => count($missingFiles),
            'missing_files' => $missingFiles,
        ]);
    }

    public function check_items_images()
    {
        $missingFiles = [];

        $items = Item::whereNotNull('thumbnail')
            ->where('thumbnail', '!=', '')
            ->get(['id', 'thumbnail']);

        foreach ($items as $item) {
            $mainPath  = public_path('assets/images/items/' . $item->thumbnail);
            $thumbPath = public_path('assets/images/items/thumb/' . $item->thumbnail);

            if (!File::exists($mainPath) || !File::exists($thumbPath)) {
                $missingFiles[] = [
                    'item_id' => $item->id,
                    'thumbnail' => $item->thumbnail,
                    'missing' => [
                        'main'  => !File::exists($mainPath),
                        'thumb' => !File::exists($thumbPath),
                    ],
                    'expected_paths' => [
                        'main'  => $mainPath,
                        'thumb' => $thumbPath,
                    ],
                ];
            }
        }

        return response()->json([
            'missing_count' => count($missingFiles),
            'missing_files' => $missingFiles,
        ]);
    }
}
