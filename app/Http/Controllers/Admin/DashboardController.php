<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ItemDownloadCount;
use App\Models\ItemReadCount;
use App\Models\ItemView;
use Illuminate\Http\Request;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // new Middleware('permission:link view', only: ['index', 'show']),
            // new Middleware('permission:link create', only: ['create', 'store']),
            // new Middleware('permission:link update', only: ['edit', 'update', 'recover']),
            // new Middleware('permission:link delete', only: ['destroy', 'destroy_image']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $start = now()->subDays(90)->startOfDay();
        $end = now()->startOfDay();

        // Helper function to build chart data
        $buildChartData = function ($raw, $start, $end) {
            $data = [];
            $loopStart = $start->copy(); // fresh copy
            for ($date = $loopStart; $date <= $end; $date->addDay()) {
                $key = $date->toDateString();
                $data[] = [
                    'date' => $key,
                    'desktop' => $raw[$key]->desktop ?? 0,
                    'mobile' => $raw[$key]->mobile ?? 0,
                ];
            }
            return $data;
        };

        // Views
        $rawViews = ItemView::select(
            'view_date as date',
            DB::raw("SUM(CASE WHEN device_type = 'desktop' THEN views ELSE 0 END) as desktop"),
            DB::raw("SUM(CASE WHEN device_type = 'mobile' THEN views ELSE 0 END) as mobile")
        )
            ->whereBetween('view_date', [$start, $end])
            ->groupBy('view_date')
            ->get()
            ->keyBy('date');

        $chartDataViews = $buildChartData($rawViews, $start, $end);

        // Reads
        $rawReads = ItemReadCount::select(
            'read_date as date',
            DB::raw("SUM(CASE WHEN device_type = 'desktop' THEN `reads` ELSE 0 END) as desktop"),
            DB::raw("SUM(CASE WHEN device_type = 'mobile' THEN `reads` ELSE 0 END) as mobile")
        )
            ->whereBetween('read_date', [$start, $end])
            ->groupBy('read_date')
            ->get()
            ->keyBy('date');

        $chartDataReads = $buildChartData($rawReads, $start, $end);

        // Downloads
        $rawDownloads = ItemDownloadCount::select(
            'download_date as date',
            DB::raw("SUM(CASE WHEN device_type = 'desktop' THEN downloads ELSE 0 END) as desktop"),
            DB::raw("SUM(CASE WHEN device_type = 'mobile' THEN downloads ELSE 0 END) as mobile")
        )
            ->whereBetween('download_date', [$start, $end])
            ->groupBy('download_date')
            ->get()
            ->keyBy('date');

        $chartDataDownloads = $buildChartData($rawDownloads, $start, $end);

        // Return all chart data to Inertia
        return Inertia::render('dashboard', [
            'chartDataViews' => $chartDataViews,
            'chartDataReads' => $chartDataReads,
            'chartDataDownloads' => $chartDataDownloads,
        ]);
    }
}
