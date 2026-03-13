<?php

namespace App\Http\Controllers\Admin;

use App\Exports\TopItemViewsSummaryExport;
use App\Http\Controllers\Controller;
use App\Models\ItemCategory;
use App\Models\ItemMainCategory;
use App\Models\ItemView;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ItemViewsEngagementController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:item view', only: ['index', 'show']),
            new Middleware('permission:item create', only: ['create', 'store']),
            new Middleware('permission:item update', only: ['edit', 'update', 'recover']),
            new Middleware('permission:item delete', only: ['destroy', 'destroy_image']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function item_views(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search');
        $sortBy = $request->input('sortBy', 'view_date');
        $sortDirection = $request->input('sortDirection', 'desc');

        $device_type = $request->input('device_type');
        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');

        $main_category_code = $request->input('main_category_code');
        $category_code = $request->input('category_code');
        /*
    |--------------------------------------------------------------------------
    | Base Query
    |--------------------------------------------------------------------------
    */

        $query = ItemView::query();

        if ($device_type) {
            $query->where('device_type', $device_type);
        }

        if ($from_date) {
            $query->whereDate('view_date', '>=', $from_date);
        }

        if ($to_date) {
            $query->whereDate('view_date', '<=', $to_date);
        }

        /*
|--------------------------------------------------------------------------
| Item relation filters (category / main category)
|--------------------------------------------------------------------------
*/

        if ($main_category_code) {
            $query->whereHas('item', function ($q) use ($main_category_code) {
                $q->where('main_category_code', $main_category_code);
            });
        }

        if ($category_code) {
            $category = ItemCategory::where('code', $category_code)->first();
            $categoryChildren = [];

            if ($category) {
                $categoryChildren = $category->allChildren()->pluck('code')->toArray();
            }

            $query->whereHas('item', function ($q) use ($category_code, $categoryChildren) {
                $q->where(function ($sub) use ($category_code, $categoryChildren) {
                    $sub->where('category_code', $category_code)
                        ->orWhereIn('category_code', $categoryChildren);
                });
            });
        }

        if ($search) {
            $query->whereHas('item', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('keywords', 'LIKE', "%{$search}%");
            });
        }

        /*
    |--------------------------------------------------------------------------
    | SUMMARY (clone BEFORE paginate)
    |--------------------------------------------------------------------------
    */

        $summaryQuery = clone $query;

        $summary = [
            'total_views' => (clone $summaryQuery)->sum('views'),

            'desktop_views' => (clone $summaryQuery)
                ->where('device_type', 'desktop')
                ->sum('views'),

            'mobile_views' => (clone $summaryQuery)
                ->where('device_type', 'mobile')
                ->sum('views'),

            'today_views' => ItemView::query()->whereDate('view_date', today())
                ->sum('views'),
        ];

        /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

        $query->orderBy($sortBy, $sortDirection);
        $allowedSorts = ['id', 'view_date', 'views', 'device_type', 'created_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'view_date';
        }


        /*
    |--------------------------------------------------------------------------
    | Relations + paginate
    |--------------------------------------------------------------------------
    */

        $query->with([
            'item:id,name,name_kh,thumbnail,main_category_code,category_code',
            'item.category:id,code,name,name_kh'
        ]);

        $tableData = $query->paginate($perPage)->onEachSide(2);

        return Inertia::render('Admin/ItemEngagement/ItemViews/Index', [
            'tableData' => $tableData,
            'summary' => $summary,
            'filters' => [
                'device_type' => $device_type,
                'from_date' => $from_date,
                'to_date' => $to_date,
                'search' => $search,
            ],
            'categories' => ItemCategory::where('parent_id', null)
                ->where('item_main_category_code', $main_category_code)
                ->orderBy('order_index')
                ->withCount('items')
                ->get(),
            'mainCategories' => ItemMainCategory::orderBy('order_index')
                ->withCount('items')
                ->orderBy('name')
                ->get(),

            'subCategories' => ItemCategory::orderBy('order_index')
                ->orderByDesc('id')
                ->whereNotNull('parent_id')
                ->with(['parent:id,code'])
                ->get(),
            'main_category_code' => $main_category_code,
        ]);
    }

    public function top_item_views(Request $request)
    {
        $period = $request->input('period', 'month'); // matches front-end filter
        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sortBy');
        $sortDirection = $request->input('sortDirection', 'desc');

        $query = ItemView::query();

        $now = now();

        switch ($period) {
            case 'day':
                $query->whereDate('view_date', $now);
                break;

            case 'this_week':
                $query->whereBetween('view_date', [
                    now()->startOfWeek()->toDateString(),
                    now()->endOfWeek()->toDateString(),
                ]);
                break;

            case 'last_week':
                $query->whereBetween('view_date', [
                    now()->subWeek()->startOfWeek()->toDateString(),
                    now()->subWeek()->endOfWeek()->toDateString(),
                ]);
                break;

            case 'this_month':
                $query->whereMonth('view_date', $now->month)
                    ->whereYear('view_date', $now->year);
                break;

            case 'last_month':
                $lastMonth = now()->subMonth();
                $query->whereBetween('view_date', [
                    $lastMonth->copy()->startOfMonth()->toDateString(),
                    $lastMonth->copy()->endOfMonth()->toDateString()
                ]);
                break;

            case 'last_3_month':
                $query->whereBetween('view_date', [
                    now()->subMonths(3)->startOfMonth()->toDateString(),
                    now()->subMonth()->endOfMonth()->toDateString()
                ]);
                break;

            case 'this_year':
                $query->whereYear('view_date', $now->year);
                break;

            case 'last_year':
                $query->whereYear('view_date', $now->year - 1);
                break;

            case 'all_time':
                // no filter
                break;

            default:
                $query->whereMonth('view_date', $now->month)
                    ->whereYear('view_date', $now->year);
                break;
        }

        if ($request->filled('device_type')) {
            $query->where('device_type', $request->device_type);
        }

        // === SUMMARY ===
        $summaryQuery = clone $query;
        $summary = [
            'total_views' => $summaryQuery->sum('views'),
            'desktop_views' => (clone $summaryQuery)->where('device_type', 'desktop')->sum('views'),
            'mobile_views' => (clone $summaryQuery)->where('device_type', 'mobile')->sum('views'),
        ];

        if ($sortBy)
            $query->orderBy($sortBy, $sortDirection);

        $query->selectRaw('item_id, SUM(views) as total_views')
            ->groupBy('item_id')
            ->orderByDesc('total_views');

        $query->with([
            'item:id,name,name_kh,thumbnail,main_category_code,category_code',
            'item.category:id,code,name,name_kh'
        ]);

        $topItems = $query->paginate($perPage);

        return Inertia::render('Admin/ItemEngagement/ItemTopViews/Index', [
            'tableData' => $topItems,
            'summary' => $summary,
        ]);
    }

    public function export_top_item_views_summary(Request $request)
    {
        $periods = [
            'Today' => fn($q, $now) => $q->whereDate('view_date', $now),
            'This Week' => fn($q, $now) => $q->whereBetween('view_date', [(clone $now)->startOfWeek(), (clone $now)->endOfWeek()]),
            'Last Week' => fn($q, $now) => $q->whereBetween('view_date', [(clone $now)->subWeek()->startOfWeek(), (clone $now)->subWeek()->endOfWeek()]),
            'This Month' => fn($q, $now) => $q->whereMonth('view_date', $now->month)->whereYear('view_date', $now->year),
            'Last Month' => fn($q, $now) => $q->whereMonth('view_date', (clone $now)->subMonth()->month)->whereYear('view_date', (clone $now)->subMonth()->year),
            'Last 3 Months' => fn($q, $now) => $q->whereBetween('view_date', [(clone $now)->subMonths(3), $now]),
            'This Year' => fn($q, $now) => $q->whereYear('view_date', $now->year),
            'Last Year' => fn($q, $now) => $q->whereYear('view_date', $now->year - 1),
            'All Time' => fn($q, $now) => $q, // no filter
        ];

        $now = now();
        $summaryData = [];

        foreach ($periods as $label => $callback) {
            $query = ItemView::query();
            $callback($query, $now);

            $row = $query->selectRaw("
            SUM(CASE WHEN device_type = 'desktop' THEN views ELSE 0 END) as desktop_views,
            SUM(CASE WHEN device_type = 'mobile' THEN views ELSE 0 END) as mobile_views,
            SUM(views) as total_views
        ")->first();

            $summaryData[] = [
                'period' => $label,
                'total_views' => $row->total_views ?? 0,
                'desktop_views' => $row->desktop_views ?? 0,
                'mobile_views' => $row->mobile_views ?? 0,
            ];
        }

        return Excel::download(new TopItemViewsSummaryExport($summaryData), 'top_items_summary.xlsx');
    }
}
