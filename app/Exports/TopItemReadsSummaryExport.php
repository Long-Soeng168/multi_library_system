<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Collection;

class TopItemReadsSummaryExport implements FromCollection, WithHeadings
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function headings(): array
    {
        return ['Period', 'Total Reads', 'Desktop Reads', 'Mobile Reads'];
    }

    public function collection()
    {
        return collect($this->data)->map(fn($i) => [
            $i['period'],
            $i['total_reads'],
            $i['desktop_reads'],
            $i['mobile_reads'],
        ]);
    }
}
