<?php

namespace App\Http\Controllers\FrontPage;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ItemMainCategory;
use App\Models\KeyValue;
use App\Models\Library;
use App\Models\Page;
use App\Models\Post;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class FrontPageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recentItems = Cache::flexible('recentItems', [3600, 7200], function () {
            return Item::select(
                'id',
                'library_id', // REQUIRED
                'name',
                'name_kh',
                'short_description',
                'short_description_kh',
                'thumbnail',
                'category_code',
                'created_at'
            )
                ->with(['library' => function ($query) {
                    $query->select('id', 'name', 'name_kh', 'image');
                }])
                ->where('status', 'published')
                ->orderByDesc('id')
                ->limit(6)
                ->get();
        });

        $libraries = Cache::flexible("libraries_index_front_page", [3600, 7200], function () {
            return Library::orderBy('order_index')->get();
        });
        // return $libraries;

        return Inertia::render('FrontPage/Index', [
            'recentItems' => $recentItems,
            'libraries' => $libraries,
        ]);
    }
    public function page_show(string $page_code)
    {
        $showData = Page::where('code', $page_code)->firstOrFail();

        // return $showData;

        return Inertia::render('FrontPage/Pages/Show', [
            'showData' => $showData,
        ]);
    }

    //  NO CACHE
    // public function index()
    // {
    //     $start = microtime(as_float: true);

    //     // 1. Main Categories
    //     $mainCategories = ItemMainCategory::with([
    //         'items' => function ($q) {
    //             $q->select(
    //                 'id',
    //                 'main_category_code',
    //                 'name',
    //                 'name_kh',
    //                 'short_description',
    //                 'short_description_kh',
    //                 'thumbnail',
    //                 'category_code',
    //                 'created_at'
    //             )
    //                 ->where('status', 'published')
    //                 ->inRandomOrder()
    //                 ->limit(6);
    //         },
    //     ])
    //         ->select('id', 'code', 'name', 'name_kh', 'image')
    //         ->orderBy('order_index')
    //         ->get();

    //     // 2. Posts
    //     $posts = Post::query()
    //         ->where('status', 'published')
    //         ->orderByDesc('id')
    //         ->select('id', 'title', 'title_kh', 'category_code', 'short_description', 'short_description_kh', 'thumbnail', 'created_at')
    //         ->with('category')
    //         ->limit(4)
    //         ->get();

    //     // 3. Thesis Categories
    //     $thesisCategories = ItemCategory::select('id', 'code', 'item_main_category_code', 'name', 'name_kh', 'image', 'order_index')
    //         ->where('parent_id', null)
    //         ->where('item_main_category_code', 'theses')
    //         ->orderBy('order_index')
    //         ->get();

    //     // 4. Publication Categories
    //     $publicationCategories = ItemCategory::select('id', 'code', 'item_main_category_code', 'name', 'name_kh', 'image', 'order_index')
    //         ->where('parent_id', null)
    //         ->where('item_main_category_code', 'publications')
    //         ->orderBy('order_index')
    //         ->get();

    //     // 5. Key Value Data
    //     $keyValueData = KeyValue::select('id', 'value', 'name', 'name_kh', 'image', 'order_index', 'short_description', 'short_description_kh')
    //         ->orderBy('order_index')
    //         ->get();

    //     $runTime = (microtime(as_float: true) - $start) * 1000;
    //     // echo "Total execution time: " . round($runTime, 2) . " ms";

    //     return Inertia::render('FrontPage/Index', [
    //         'runTime' => $runTime,
    //         'keyValueData' => $keyValueData,

    //         'mainCategories' => $mainCategories,
    //         'thesisCategories' => $thesisCategories,
    //         'publicationCategories' => $publicationCategories,
    //         'posts' => $posts,
    //     ]);
    // }
}
