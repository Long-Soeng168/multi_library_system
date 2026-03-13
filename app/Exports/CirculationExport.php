<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CirculationExport implements FromCollection, WithHeadings
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    // 🔥 THIS CREATES HEADER ROW
    public function headings(): array
    {
        return [
            'ID',
            'Borrower',
            'Card Number',
            'Title',
            'Barcode',
            'Loan Date',
            'Due Date',
            'Returned At',
            'Fine Amount',
            'Fine Paid',
        ];
    }

    public function collection()
    {
        return collect($this->data)->map(function ($c) {
            return [
                $c->id,
                $c->borrower->name ?? '',
                $c->borrower->card_number ?? '',
                $c->item_physical_copy->item->name ?? '',
                $c->item_physical_copy->barcode ?? '',

                $c->borrowed_at ? Carbon::parse($c->borrowed_at)->format('d-m-Y') : '',
                $c->due_at ? Carbon::parse($c->due_at)->format('d-m-Y') : '',
                $c->returned_at ? Carbon::parse($c->returned_at)->format('d-m-Y') : '',

                $c->fine_amount,
                $c->fine_paid ? 'Yes' : 'No',
            ];
        });
    }
}
