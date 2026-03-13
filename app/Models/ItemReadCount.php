<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemReadCount extends Model
{
    protected $guarded = [];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }
}
