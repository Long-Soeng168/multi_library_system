<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Collection;

class TopItemDownloadsSummaryExport implements FromCollection, WithHeadings
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function headings(): array
    {
        return ['Period', 'Total Downloads', 'Desktop Downloads', 'Mobile Downloads'];
    }

    public function collection()
    {
        return collect($this->data)->map(fn($i) => [
            $i['period'],
            $i['total_downloads'],
            $i['desktop_downloads'],
            $i['mobile_downloads'],
        ]);
    }
}
