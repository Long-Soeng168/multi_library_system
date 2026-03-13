<?php

namespace App\Http\Controllers\Admin;

use App\Exports\TopItemReadsSummaryExport;
use App\Http\Controllers\Controller;
use App\Models\ItemCategory;
use App\Models\ItemMainCategory;
use App\Models\ItemReadCount;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ItemReadsEngagementController extends Controller implements HasMiddleware
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
    public function item_reads(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search');
        $sortBy = $request->input('sortBy', 'read_date');
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

        $query = ItemReadCount::query();

        if ($device_type) {
            $query->where('device_type', $device_type);
        }

        if ($from_date) {
            $query->whereDate('read_date', '>=', $from_date);
        }

        if ($to_date) {
            $query->whereDate('read_date', '<=', $to_date);
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
            'total_reads' => (clone $summaryQuery)->sum('reads'),

            'desktop_reads' => (clone $summaryQuery)
                ->where('device_type', 'desktop')
                ->sum('reads'),

            'mobile_reads' => (clone $summaryQuery)
                ->where('device_type', 'mobile')
                ->sum('reads'),

            'today_reads' => ItemReadCount::query()->whereDate('read_date', today())
                ->sum('reads'),
        ];

        /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

        $query->orderBy($sortBy, $sortDirection);
        $allowedSorts = ['id', 'read_date', 'reads', 'device_type', 'created_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'read_date';
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

        return Inertia::render('Admin/ItemEngagement/ItemReads/Index', [
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

    public function top_item_reads(Request $request)
    {
        $period = $request->input('period', 'month'); // matches front-end filter
        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sortBy');
        $sortDirection = $request->input('sortDirection', 'desc');

        $query = ItemReadCount::query();

        $now = now();

        switch ($period) {
            case 'day':
                $query->whereDate('read_date', $now);
                break;

            case 'this_week':
                $query->whereBetween('read_date', [
                    now()->startOfWeek()->toDateString(),
                    now()->endOfWeek()->toDateString(),
                ]);
                break;

            case 'last_week':
                $query->whereBetween('read_date', [
                    now()->subWeek()->startOfWeek()->toDateString(),
                    now()->subWeek()->endOfWeek()->toDateString(),
                ]);
                break;

            case 'this_month':
                $query->whereMonth('read_date', $now->month)
                    ->whereYear('read_date', $now->year);
                break;

            case 'last_month':
                $lastMonth = now()->subMonth();
                $query->whereBetween('read_date', [
                    $lastMonth->copy()->startOfMonth()->toDateString(),
                    $lastMonth->copy()->endOfMonth()->toDateString()
                ]);
                break;

            case 'last_3_month':
                $query->whereBetween('read_date', [
                    now()->subMonths(3)->startOfMonth()->toDateString(),
                    now()->subMonth()->endOfMonth()->toDateString()
                ]);
                break;

            case 'this_year':
                $query->whereYear('read_date', $now->year);
                break;

            case 'last_year':
                $query->whereYear('read_date', $now->year - 1);
                break;

            case 'all_time':
                // no filter
                break;

            default:
                $query->whereMonth('read_date', $now->month)
                    ->whereYear('read_date', $now->year);
                break;
        }

        if ($request->filled('device_type')) {
            $query->where('device_type', $request->device_type);
        }

        // === SUMMARY ===
        $summaryQuery = clone $query;
        $summary = [
            'total_reads' => $summaryQuery->sum('reads'),
            'desktop_reads' => (clone $summaryQuery)->where('device_type', 'desktop')->sum('reads'),
            'mobile_reads' => (clone $summaryQuery)->where('device_type', 'mobile')->sum('reads'),
        ];

        if ($sortBy)
            $query->orderBy($sortBy, $sortDirection);

        $query->selectRaw('item_id, SUM(`reads`) as total_reads')
            ->groupBy('item_id')
            ->orderByDesc('total_reads');

        $query->with([
            'item:id,name,name_kh,thumbnail,main_category_code,category_code',
            'item.category:id,code,name,name_kh'
        ]);

        $topItems = $query->paginate($perPage);

        return Inertia::render('Admin/ItemEngagement/ItemTopReads/Index', [
            'tableData' => $topItems,
            'summary' => $summary,
        ]);
    }

    public function export_top_items_summary(Request $request)
    {
        // Use an array of closures that return range-based queries (Index Friendly)
        $periods = [
            'Today'         => fn($q) => $q->whereDate('read_date', today()),
            'This Week'     => fn($q) => $q->whereBetween('read_date', [now()->startOfWeek()->toDateString(), now()->endOfWeek()->toDateString()]),
            'Last Week'     => fn($q) => $q->whereBetween('read_date', [now()->subWeek()->startOfWeek()->toDateString(), now()->subWeek()->endOfWeek()->toDateString()]),
            'This Month'    => fn($q) => $q->whereBetween('read_date', [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()]),
            'Last Month'    => fn($q) => $q->whereBetween('read_date', [now()->subMonth()->startOfMonth()->toDateString(), now()->subMonth()->endOfMonth()->toDateString()]),
            'Last 3 Months' => fn($q) => $q->whereBetween('read_date', [now()->subMonths(3)->startOfMonth()->toDateString(), now()->subMonth()->endOfMonth()->toDateString()]),
            'This Year'     => fn($q) => $q->whereYear('read_date', now()->year), // Year is usually okay if indexed by year, but Date range is safer
            'Last Year'     => fn($q) => $q->whereYear('read_date', now()->year - 1),
            'All Time'      => fn($q) => $q,
        ];

        $summaryData = [];

        foreach ($periods as $label => $callback) {
            $query = ItemReadCount::query();
            $callback($query);

            // Fixed reserved keyword 'reads' with backticks
            $row = $query->selectRaw("
            SUM(CASE WHEN device_type = 'desktop' THEN `reads` ELSE 0 END) as desktop_reads,
            SUM(CASE WHEN device_type = 'mobile' THEN `reads` ELSE 0 END) as mobile_reads,
            SUM(`reads`) as total_reads
        ")->first();

            $summaryData[] = [
                'period'        => $label,
                'total_reads'   => $row->total_reads ?? 0,
                'desktop_reads' => $row->desktop_reads ?? 0,
                'mobile_reads'  => $row->mobile_reads ?? 0,
            ];
        }

        return Excel::download(new TopItemReadsSummaryExport($summaryData), 'top_item_reads_summary.xlsx');
    }
}
