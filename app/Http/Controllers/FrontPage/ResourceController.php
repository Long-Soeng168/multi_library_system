<?php

namespace App\Http\Controllers\FrontPage;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ItemMainCategory;
use App\Models\ItemView;
use App\Models\Language;
use App\Models\Library;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ResourceController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $cacheKey = "main_categories_search_" . md5($search);

        $mainCategories = Cache::flexible($cacheKey, [3600, 7200], function () use ($search) {
            return ItemMainCategory::with([
                'items' => function ($q) use ($search) {
                    $q->select(
                        'id',
                        'main_category_code', // REQUIRED
                        'name',
                        'name_kh',
                        'short_description',
                        'short_description_kh',
                        'thumbnail',
                        'category_code',
                        'created_at'
                    )->when($search, function ($sub) use ($search) {
                        $sub->where(function ($w) use ($search) {
                            $w->where('name', 'like', "%{$search}%")
                                ->orWhere('name_kh', 'like', "%{$search}%")
                                ->orWhere('published_year', 'like', "%{$search}%")
                                ->orWhere('keywords', 'like', "%{$search}%")
                                ->orWhere('author_name', 'like', "%{$search}%");

                            if (is_numeric($search)) {
                                $w->orWhere('id', $search);
                            }
                        });
                    })
                        ->where('status', 'published')
                        ->orderByDesc('id')
                        ->limit(9);
                },
            ])
                ->select('id', 'code', 'name', 'name_kh', 'image')
                ->orderBy('order_index')
                ->get();
        });

        // return [
        //     'mainCategories' => $mainCategories,
        // ];

        return Inertia::render(
            'FrontPage/Resources/Index',
            [
                'mainCategories' => $mainCategories,
                'search' => $search,
            ]
        );
    }



    public function item_show(string $id, Request $request)
    {
        $showData = Cache::flexible("item_details_{$id}", [3600, 7200], function () use ($id) {
            return Item::findOrFail($id)->load(
                'library',
                'images',
                'publisher',
                'authors',
                'advisor',
                'language',
                'category.parent',
                'physical_copies.library',
                'physical_copies.item_type',
            );
        });

        // return ($showData);

        if ($showData->status === 'unpublished') {
            abort(403);
        }

        $main_category_code = $showData->main_category_code;
        $mainCategory = Cache::flexible("main_cat_lookup_{$main_category_code}", [3600, 7200], function () use ($main_category_code) {
            return ItemMainCategory::select('id', 'code', 'name', 'name_kh', 'image')->where('code', $main_category_code)->first();
        });

        // URL main category != actual item main category → redirect
        if ($mainCategory && $mainCategory->code !== $main_category_code) {
            return redirect()
                ->to("/resources/{$mainCategory->code}/{$id}")
                ->setStatusCode(301); // SEO-friendly
        }

        $cacheKey = "related_items_{$showData->category_code}_{$id}";

        $relatedData = Cache::flexible($cacheKey, [3600, 7200], function () use ($showData, $main_category_code, $id) {
            $query = Item::query();
            $query->select('id', 'name', 'name_kh', 'short_description', 'short_description_kh', 'thumbnail', 'category_code', 'created_at');

            return $query->where('category_code', $showData->category_code)
                ->where('status', 'published')
                ->where('main_category_code',  $main_category_code)
                ->where('id', '!=', $id)
                ->inRandomOrder()->limit(9)
                ->get();
        });

        // UPDATE VIEW COUNT
        $today = now()->toDateString();
        $device = str_contains(
            strtolower(request()->header('User-Agent', '')),
            'mobile'
        ) ? 'mobile' : 'desktop';

        $itemView = ItemView::firstOrCreate(
            [
                'item_id' => $showData->id,
                'view_date' => $today,
                'device_type' => $device,
            ],
            [
                'views' => 0,
            ]
        );

        $itemView->increment('views');
        $showData->increment('total_view_count');


        return Inertia::render(
            'FrontPage/Resources/Show',
            [
                'mainCategory' => $mainCategory,
                'showData' => $showData,
                'relatedData' => $relatedData,
            ]
        );
    }
    public function main_category(string $main_category_code, Request $request)
    {
        $mainCategory = Cache::flexible("mainCategory_{$main_category_code}", [3600, 7200], function () use ($main_category_code) {
            return ItemMainCategory::select('id', 'code', 'name', 'name_kh', 'image')
                ->where('code', $main_category_code)
                ->firstOrFail();
        });

        $perPage = $request->input('perPage', 16);
        $search = $request->input('search', '');

        $sort_by = $request->input('sort_by');
        $from_year = $request->input('from_year');
        $to_year = $request->input('to_year');

        $category_code = $request->input('category_code');
        $author_id = $request->input('author_id');
        $publisher_id = $request->input('publisher_id');
        $advisor_id = $request->input('advisor_id');
        $language_code = $request->input('language_code');

        $params = [
            $main_category_code,
            $search,
            $category_code,
            $language_code,
            $publisher_id,
            $advisor_id,
            $from_year,
            $to_year,
            $author_id,
            $sort_by,
            $perPage,
            request('page', 1) // Don't forget the page!
        ];
        $key = "tableData_" . md5(json_encode($params));
        $tableData = Cache::flexible($key, [3600, 7200], function () use ($main_category_code, $search, $category_code, $language_code, $publisher_id, $advisor_id, $from_year, $to_year, $author_id, $sort_by, $perPage) {
            $query = Item::query();

            $query->select('id', 'name', 'name_kh', 'short_description', 'short_description_kh', 'thumbnail', 'category_code', 'main_category_code', 'created_at');

            if ($category_code) {
                $category = ItemCategory::where('code', $category_code)->first();
                $categoryChildren = [];
                if (!empty($category)) {
                    $categoryChildren = $category->allChildren()->pluck('code')->toArray();
                    // return $categoryChildren;
                }
                $query->where(function ($sub_query) use ($category_code, $categoryChildren) {
                    return $sub_query->where('category_code', $category_code)
                        ->orWhereIn('category_code', $categoryChildren);
                });
            }

            if ($language_code) {
                $query->where('language_code', $language_code);
            }
            if ($publisher_id) {
                $query->where('publisher_id', $publisher_id);
            }
            if ($advisor_id) {
                $query->where('advisor_id', $advisor_id);
            }

            if ($from_year && $to_year && $from_year > $to_year) {
                [$from_year, $to_year] = [$to_year, $from_year];
            }
            if ($from_year && $to_year) {
                $query->whereBetween('published_year', [(int)$from_year, (int)$to_year]);
            } elseif ($from_year) {
                $query->where('published_year', '>=', (int)$from_year);
            } elseif ($to_year) {
                $query->where('published_year', '<=', (int)$to_year);
            }


            if ($author_id) {
                $query->whereHas(
                    'authors',
                    fn($q) =>
                    $q->where('author_id', $author_id)
                );
            }

            if ($sort_by) {
                match ($sort_by) {
                    'latest' =>
                    $query->orderBy('published_year', 'desc'),

                    'oldest' =>
                    $query->orderBy('published_year'),

                    'title-asc' =>
                    $query->orderBy('name'),

                    'title-desc' =>
                    $query->orderBy('name', 'desc'),

                    'most-read' =>
                    $query->orderBy('total_read_count', 'desc'),

                    'most-view' =>
                    $query->orderBy('total_view_count', 'desc'),

                    default =>
                    $query->orderBy('id', 'desc'),
                };
            }


            if ($search) {
                $query->when($search, function ($sub) use ($search) {
                    $sub->where(function ($w) use ($search) {
                        $w->where('name', 'like', "%{$search}%")
                            ->orWhere('name_kh', 'like', "%{$search}%")
                            ->orWhere('published_year', 'like', "%{$search}%")
                            ->orWhere('keywords', 'like', "%{$search}%")
                            ->orWhere('author_name', 'like', "%{$search}%");

                        if (is_numeric($search)) {
                            $w->orWhere('id', $search);
                        }
                    });
                });
            }

            $query->where('status', 'published');
            $query->where('main_category_code', $main_category_code);
            if ($from_year) {
                $query->orderBy('published_year');
            } else {
                $query->orderBy('id', 'desc');
            }

            return $query->paginate($perPage)->onEachSide(2);
        });


        $categories = Cache::flexible("categories_tree_{$main_category_code}", [3600, 7200], function () use ($main_category_code) {
            return ItemCategory::select('id', 'code', 'item_main_category_code', 'name', 'name_kh', 'image', 'order_index')->where('parent_id', null)
                ->where('item_main_category_code', $main_category_code)
                ->orderBy('order_index')
                ->with(['children' => function ($q) {
                    $q->select('id', 'code', 'parent_id', 'name', 'name_kh', 'image', 'order_index')->orderBy('order_index');
                }])
                ->get();
        });

        $publishers = null;
        $authors = null;

        if ($main_category_code !== 'theses') {
            $authors = Cache::flexible("authors_{$main_category_code}", [3600, 7200], function () use ($main_category_code) {
                if ($main_category_code === 'theses') return null;
                return User::role('Author')
                    ->orderByDesc('author_items_count')
                    ->orderBy('name')
                    ->select('id', 'name', 'name_kh', 'title_type_code')
                    ->withCount([
                        'author_items' => fn($q) =>
                        $q->where('main_category_code', $main_category_code),
                    ])
                    ->having('author_items_count', '>', 0)
                    ->get();
            });

            $publishers = Cache::flexible("publishers_{$main_category_code}", [3600, 7200], function () use ($main_category_code) {
                if ($main_category_code === 'theses') return null;
                return User::role('Publisher')
                    ->orderByDesc('publisher_items_count')
                    ->orderBy('name')
                    ->select('id', 'name', 'name_kh', 'title_type_code')
                    ->withCount([
                        'publisher_items' => fn($q) =>
                        $q->where('main_category_code', $main_category_code),
                    ])
                    ->having('publisher_items_count', '>', 0)
                    ->get();
            });
        }


        $advisors = null;
        if ($main_category_code === 'theses') {

            $advisors = Cache::flexible("advisors_{$main_category_code}", [3600, 7200], function () use ($main_category_code) {
                if ($main_category_code !== 'theses') return null;
                return User::role('Advisor')
                    ->orderByDesc('advisor_items_count')
                    ->orderBy('name')
                    ->select('id', 'name', 'name_kh', 'title_type_code')
                    ->withCount([
                        'advisor_items' => fn($q) =>
                        $q->where('main_category_code', $main_category_code),
                    ])
                    ->having('advisor_items_count', '>', 0)
                    ->get();
            });
        }

        $languages = Cache::flexible("languages_{$main_category_code}", [3600, 7200], function () use ($main_category_code) {
            return Language::select('id', 'code', 'name', 'name_kh', 'image')
                ->orderByDesc('items_count')
                ->orderBy('order_index')
                ->withCount([
                    'items' => fn($q) =>
                    $q->where('main_category_code', $main_category_code),
                ])
                ->having('items_count', '>', 0)
                ->get();
        });

        // return [
        //     'mainCategory' => $mainCategory,
        //     'tableData' => $tableData,
        //     'languages' => $languages,
        //     'categories' => $categories,
        //     'authors' => $authors,
        //     'publishers' => $publishers,
        //     'advisors' => $advisors,
        // ];

        return Inertia::render('FrontPage/Resources/MainCategory', [
            'mainCategory' => $mainCategory,
            'tableData' => $tableData,
            'languages' => $languages,
            'categories' => $categories,
            'authors' => $authors,
            'publishers' => $publishers,
            'advisors' => $advisors,
        ]);
    }
    public function libraries(Request $request)
    {
        // 1. Setup global params for the cache key (removed main_category_code)
        $perPage = $request->input('perPage', 16);
        $search = $request->input('search', '');
        $sort_by = $request->input('sort_by');
        $from_year = $request->input('from_year');
        $to_year = $request->input('to_year');
        $author_id = $request->input('author_id');
        $publisher_id = $request->input('publisher_id');
        $advisor_id = $request->input('advisor_id');
        $library_id = $request->input('library_id');
        $language_code = $request->input('language_code');

        $params = [
            $search,
            $language_code,
            $publisher_id,
            $advisor_id,
            $library_id,
            $from_year,
            $to_year,
            $author_id,
            $sort_by,
            $perPage,
            request('page', 1)
        ];

        $key = "tableData_global_" . md5(json_encode($params));

        $tableData = Cache::flexible($key, [3600, 7200], function () use ($search, $library_id, $language_code, $publisher_id, $advisor_id, $from_year, $to_year, $author_id, $sort_by, $perPage) {
            $query = Item::query();
            // $query->select('id', 'name', 'name_kh', 'short_description', 'short_description_kh', 'thumbnail', 'category_code', 'main_category_code', 'created_at');
            $query->with(
                'publisher',
                'authors',
                'advisor',
                'language',
                'category',
                'library',
            );

            if ($language_code) $query->where('language_code', $language_code);
            if ($publisher_id) $query->where('publisher_id', $publisher_id);
            if ($advisor_id) $query->where('advisor_id', $advisor_id);
            if ($library_id) $query->where('library_id', $library_id);

            if ($from_year && $to_year && $from_year > $to_year) {
                [$from_year, $to_year] = [$to_year, $from_year];
            }

            if ($from_year && $to_year) {
                $query->whereBetween('published_year', [(int)$from_year, (int)$to_year]);
            } elseif ($from_year) {
                $query->where('published_year', '>=', (int)$from_year);
            } elseif ($to_year) {
                $query->where('published_year', '<=', (int)$to_year);
            }

            if ($author_id) {
                $query->whereHas('authors', fn($q) => $q->where('author_id', $author_id));
            }

            if ($sort_by) {
                match ($sort_by) {
                    'latest' => $query->orderBy('published_year', 'desc'),
                    'oldest' => $query->orderBy('published_year'),
                    'title-asc' => $query->orderBy('name'),
                    'title-desc' => $query->orderBy('name', 'desc'),
                    'most-read' => $query->orderBy('total_read_count', 'desc'),
                    'most-view' => $query->orderBy('total_view_count', 'desc'),
                    default => $query->orderBy('id', 'desc'),
                };
            }

            if ($search) {
                $query->where(function ($w) use ($search) {
                    $w->where('name', 'like', "%{$search}%")
                        ->orWhere('name_kh', 'like', "%{$search}%")
                        ->orWhere('published_year', 'like', "%{$search}%")
                        ->orWhere('keywords', 'like', "%{$search}%")
                        ->orWhere('author_name', 'like', "%{$search}%");
                    if (is_numeric($search)) $w->orWhere('id', $search);
                });
            }

            $query->where('status', 'published');

            // Removed: $query->where('main_category_code', $main_category_code);

            $from_year ? $query->orderBy('published_year') : $query->orderBy('id', 'desc');

            return $query->paginate($perPage)->onEachSide(2);
        });

        // Define the dynamic part once
        $library_suffix = $library_id ? md5(json_encode($library_id)) : 'global';

        // 1. Authors Key
        $authorsKey = "authors_" . $library_suffix;
        $authors = Cache::flexible($authorsKey, [3600, 7200], function () use ($library_id) {
            return User::role('Author')
                ->when($library_id, fn($q) => $q->where('library_id', $library_id))
                ->select('id', 'name', 'name_kh', 'title_type_code', 'library_id')
                ->withCount('author_items')
                // ->having('author_items_count', '>', 0)
                ->orderByDesc('author_items_count')
                ->get();
        });

        // 2. Publishers Key (Must be different from Authors Key)
        $publishersKey = "publishers_" . $library_suffix;
        $publishers = Cache::flexible($publishersKey, [3600, 7200], function () use ($library_id) {
            return User::role('Publisher')
                ->when($library_id, fn($q) => $q->where('library_id', $library_id))
                ->select('id', 'name', 'name_kh', 'title_type_code', 'library_id')
                ->withCount('publisher_items')
                // ->having('publisher_items_count', '>', 0)
                ->orderByDesc('publisher_items_count')
                ->get();
        });

        // return $authors;

        $languages = Cache::flexible("languages_global", [3600, 7200], function () {
            return Language::select('id', 'code', 'name', 'name_kh', 'image')
                ->orderByDesc('items_count')
                ->withCount('items')
                ->having('items_count', '>', 0)
                ->get();
        });
        $libraries = Cache::flexible("libraries_global", [3600, 7200], function () {
            return Library::whereNull('external_link')->orderBy('order_index')->get();
        });

        // return $tableData;

        return Inertia::render('FrontPage/Libraries/Index', [
            'mainCategory' => null, // No specific main category selected
            'libraries'    => $libraries,
            'tableData'    => $tableData,
            'languages'    => $languages,
            'authors'      => $authors,
            'publishers'   => $publishers,
            'advisors'     => [],
        ]);
    }


    public function library_show(Request $request, string $library_id)
    {
        $library = Cache::flexible("library_{$library_id}", [3600, 7200], function () use ($library_id) {
            return Library::findOrFail($library_id);
        });

        // return ($library);

        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');

        $sort_by = $request->input('sort_by');
        $from_year = $request->input('from_year');
        $to_year = $request->input('to_year');

        $category_code = $request->input('category_code');
        $author_id = $request->input('author_id');
        $publisher_id = $request->input('publisher_id');
        $advisor_id = $request->input('advisor_id');
        $language_code = $request->input('language_code');

        $params = [
            $library_id,
            $search,
            $category_code,
            $language_code,
            $publisher_id,
            $advisor_id,
            $from_year,
            $to_year,
            $author_id,
            $sort_by,
            $perPage,
            request('page', 1) // Don't forget the page!
        ];
        $key = "tableData_" . md5(json_encode($params));
        $tableData = Cache::flexible($key, [3600, 7200], function () use ($library_id, $search, $category_code, $language_code, $publisher_id, $advisor_id, $from_year, $to_year, $author_id, $sort_by, $perPage) {
            $query = Item::query();

            // $query->select('id', 'name', 'name_kh', 'short_description', 'short_description_kh', 'thumbnail', 'category_code', 'library_id', 'created_at');
            $query->with(
                'library',
                'publisher',
                'authors',
                'advisor',
                'language',
                'category',
            );
            if ($category_code) {
                $category = ItemCategory::where('code', $category_code)->first();
                $categoryChildren = [];
                if (!empty($category)) {
                    $categoryChildren = $category->allChildren()->pluck('code')->toArray();
                    // return $categoryChildren;
                }
                $query->where(function ($sub_query) use ($category_code, $categoryChildren) {
                    return $sub_query->where('category_code', $category_code)
                        ->orWhereIn('category_code', $categoryChildren);
                });
            }

            if ($language_code) {
                $query->where('language_code', $language_code);
            }
            if ($publisher_id) {
                $query->where('publisher_id', $publisher_id);
            }
            if ($advisor_id) {
                $query->where('advisor_id', $advisor_id);
            }

            if ($from_year && $to_year && $from_year > $to_year) {
                [$from_year, $to_year] = [$to_year, $from_year];
            }
            if ($from_year && $to_year) {
                $query->whereBetween('published_year', [(int)$from_year, (int)$to_year]);
            } elseif ($from_year) {
                $query->where('published_year', '>=', (int)$from_year);
            } elseif ($to_year) {
                $query->where('published_year', '<=', (int)$to_year);
            }


            if ($author_id) {
                $query->whereHas(
                    'authors',
                    fn($q) =>
                    $q->where('author_id', $author_id)
                );
            }

            if ($sort_by) {
                match ($sort_by) {
                    'latest' =>
                    $query->orderBy('published_year', 'desc'),

                    'oldest' =>
                    $query->orderBy('published_year'),

                    'title-asc' =>
                    $query->orderBy('name'),

                    'title-desc' =>
                    $query->orderBy('name', 'desc'),

                    'most-read' =>
                    $query->orderBy('total_read_count', 'desc'),

                    'most-view' =>
                    $query->orderBy('total_view_count', 'desc'),

                    default =>
                    $query->orderBy('id', 'desc'),
                };
            }


            if ($search) {
                $query->when($search, function ($sub) use ($search) {
                    $sub->where(function ($w) use ($search) {
                        $w->where('name', 'like', "%{$search}%")
                            ->orWhere('name_kh', 'like', "%{$search}%")
                            ->orWhere('published_year', 'like', "%{$search}%")
                            ->orWhere('keywords', 'like', "%{$search}%")
                            ->orWhere('author_name', 'like', "%{$search}%");

                        if (is_numeric($search)) {
                            $w->orWhere('id', $search);
                        }
                    });
                });
            }

            $query->where('status', 'published');
            $query->where('library_id', $library_id);
            if ($from_year) {
                $query->orderBy('published_year');
            } else {
                $query->orderBy('id', 'desc');
            }

            return $query->paginate($perPage)->onEachSide(2);
        });


        $categories = Cache::flexible("categories_tree_{$library_id}", [3600, 7200], function () use ($library_id) {
            return ItemCategory::select('id', 'code', 'library_id', 'name', 'name_kh', 'image', 'order_index')->where('parent_id', null)
                ->where('library_id', $library_id)
                ->orderBy('order_index')
                ->with(['children' => function ($q) {
                    $q->select('id', 'code', 'parent_id', 'name', 'name_kh', 'image', 'order_index')->orderBy('order_index');
                }])
                ->get();
        });

        // Define the dynamic part once
        $library_suffix = $library_id ? md5(json_encode($library_id)) : 'global';

        // 1. Authors Key
        $authorsKey = "authors_" . $library_suffix;
        $authors = Cache::flexible($authorsKey, [3600, 7200], function () use ($library_id) {
            return User::role('Author')
                ->when($library_id, fn($q) => $q->where('library_id', $library_id))
                ->select('id', 'name', 'name_kh', 'title_type_code', 'library_id')
                ->withCount('author_items')
                // ->having('author_items_count', '>', 0)
                ->orderByDesc('author_items_count')
                ->get();
        });

        // 2. Publishers Key (Must be different from Authors Key)
        $publishersKey = "publishers_" . $library_suffix;
        $publishers = Cache::flexible($publishersKey, [3600, 7200], function () use ($library_id) {
            return User::role('Publisher')
                ->when($library_id, fn($q) => $q->where('library_id', $library_id))
                ->select('id', 'name', 'name_kh', 'title_type_code', 'library_id')
                ->withCount('publisher_items')
                // ->having('publisher_items_count', '>', 0)
                ->orderByDesc('publisher_items_count')
                ->get();
        });

        $languages = Cache::flexible("languages_{$library_id}", [3600, 7200], function () use ($library_id) {
            return Language::select('id', 'code', 'name', 'name_kh', 'image')
                ->orderByDesc('items_count')
                ->orderBy('order_index')
                ->withCount([
                    'items' => fn($q) =>
                    $q->where('library_id', $library_id),
                ])
                ->having('items_count', '>', 0)
                ->get();
        });

        // return [
        //     'library' => $library,
        //     'tableData' => $tableData,
        //     'languages' => $languages,
        //     'categories' => $categories,
        //     'authors' => $authors,
        //     'publishers' => $publishers,
        //     'advisors' => $advisors,
        // ];

        return Inertia::render('FrontPage/Libraries/Show', [
            'libraryInfo' => $library,
            'tableData' => $tableData,
            'languages' => $languages,
            'categories' => $categories,
            'authors' => $authors,
            'publishers' => $publishers,
        ]);
    }
}
