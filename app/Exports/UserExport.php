<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UserExport implements FromCollection, WithHeadings
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
            'Card Number',
            'Name',
            'Name KH',
            'Gender',
            'Email',
            'Phone',
            'Category',
            'Role(s)',
            'Total Active Loan',
            'Total Checkouts',
            'expired_at',
            'Created By',
            'Updated By',
            'Created At',
            'Updated At',
        ];
    }

    public function collection()
    {
        return collect($this->data)->map(function ($u) {
            return [
                $u->id,
                $u->card_number ?? '',
                $u->name ?? '',
                $u->name_kh ?? '',
                $u->gender ?? '',
                $u->email ?? '',
                $u->phone ?? '',
                $u->category_code ?? '',
                $u->roles->pluck('name')->implode(', '),
                $u->total_active_loan ?? 0,
                $u->total_checkouts ?? 0,
                $u->expired_at ? Carbon::parse($u->expired_at)->format('d-m-Y') : '',
                $u->created_user?->name ?? '',
                $u->updated_user?->name ?? '',
                $u->created_at ? Carbon::parse($u->created_at)->format('d-m-Y') : '',
                $u->updated_at ? Carbon::parse($u->updated_at)->format('d-m-Y') : '',
            ];
        });
    }
}
