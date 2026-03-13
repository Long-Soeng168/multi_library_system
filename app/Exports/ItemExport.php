<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ItemExport implements FromCollection, WithHeadings
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function headings(): array
    {
        return [
            'ID',

            'Title',
            'Title KH',

            'Short Desc',
            'Short Desc KH',
            'Long Desc',
            'Long Desc KH',

            'Keywords',
            'Status',
            'External Link',

            'File Type',
            'Main Category Code',
            'Category',
            'Language',

            'Thumbnail',
            'File Name',
            'Total Page',

            'View Count',
            'Read Count',
            'Download Count',
            'Total Checkouts',

            'DDC',
            'LCC',
            'ISBN',
            'EISBN',
            'DOI',

            'Authors',
            'Free Type Author',
            'Advisor',
            'Publisher',

            'Published Year',
            'Published Month',
            'Published Day',

            'Created By',
            'Updated By',

            'Created At',
            'Updated At',
        ];
    }

    public function collection()
    {
        return collect($this->data)->map(function ($i) {

            $authors = $i->authors->pluck('name')->implode(', ');

            return [
                $i->id,

                $i->name ?? '',
                $i->name_kh ?? '',

                $i->short_description ?? '',
                $i->short_description_kh ?? '',
                $i->long_description ?? '',
                $i->long_description_kh ?? '',

                $i->keywords ?? '',
                $i->status ?? '',
                $i->external_link ?? '',

                $i->file_type?->name ?? '',
                $i->main_category_code ?? '',
                $i->category?->name ?? '',
                $i->language?->name ?? '',

                $i->thumbnail ?? '',
                $i->file_name ?? '',
                $i->total_page ?? '',

                $i->total_view_count ?? 0,
                $i->total_read_count ?? 0,
                $i->total_download_count ?? 0,
                $i->total_checkouts ?? 0,

                $i->ddc ?? '',
                $i->lcc ?? '',
                $i->isbn ?? '',
                $i->eisbn ?? '',
                $i->doi ?? '',

                $authors,
                $i->author_name ?? '',
                $i->advisor?->name ?? '',
                $i->publisher?->name ?? '',

                $i->published_year ?? '',
                $i->published_month ?? '',
                $i->published_day ?? '',

                $i->created_user?->name ?? '',
                $i->updated_user?->name ?? '',

                $i->created_at ? Carbon::parse($i->created_at)->format('d-m-Y') : '',
                $i->updated_at ? Carbon::parse($i->updated_at)->format('d-m-Y') : '',
            ];
        });
    }
}
