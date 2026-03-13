<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Collection;

class TopItemViewsSummaryExport implements FromCollection, WithHeadings
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function headings(): array
    {
        return ['Period', 'Total Views', 'Desktop Views', 'Mobile Views'];
    }

    public function collection()
    {
        return collect($this->data)->map(fn($i) => [
            $i['period'],
            $i['total_views'],
            $i['desktop_views'],
            $i['mobile_views'],
        ]);
    }
}
