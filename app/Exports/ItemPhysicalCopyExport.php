<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ItemPhysicalCopyExport implements FromCollection, WithHeadings
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function headings(): array
    {
        return [
            'Barcode',
            'Full Call Number',

            'Item ID',
            'Item Title',

            'Physical Copy Type',
            'Shelf Location',
            'Home Library',
            'Current Library',

            'Public Note',
            'Staff Note',

            'Lost Status',
            'Not For Loan',
            'Damaged',
            'Withdrawn',

            'Total Checkouts',

            'Borrowed At',
            'Due At',
            'Last Borrowed At',
            'Last Seen At',

            'Created By',
            'Updated By',

            'Created At',
            'Updated At',
        ];
    }

    public function collection()
    {
        return collect($this->data)->map(function ($c) {

            return [
                $c->barcode ?? '',
                $c->full_call_number ?? '',

                $c->item_id,
                $c->item?->name ?? '',

                $c->item_type?->name ?? '',
                $c->shelf_location?->name ?? '',
                $c->home_library?->name ?? '',
                $c->current_library?->name ?? '',

                $c->public_note ?? '',
                $c->unpublic_note ?? '',

                $c->item_lost ? 'Yes' : 'No',
                $c->not_for_loan ? 'Yes' : 'No',
                $c->damaged ? 'Yes' : 'No',
                $c->withdrawn ? 'Yes' : 'No',

                $c->total_checkouts ?? 0,

                $this->date($c->borrowed_at),
                $this->date($c->due_at),
                $this->date($c->last_borrowed_at),
                $this->date($c->last_seen_at),

                $c->created_user?->name ?? '',
                $c->updated_user?->name ?? '',

                $this->date($c->created_at),
                $this->date($c->updated_at),
            ];
        });
    }

    private function date($value)
    {
        return $value ? Carbon::parse($value)->format('d-m-Y') : '';
    }
}
