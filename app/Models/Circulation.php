<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Circulation extends Model
{
    use SoftDeletes;
    protected $guarded = [];

    public function library()
    {
        return $this->belongsTo(Library::class, 'library_id', 'id');
    }
    public function item_physical_copy()
    {
        return $this->belongsTo(ItemPhysicalCopy::class, 'item_physical_copy_id', 'id');
    }
    public function borrower()
    {
        return $this->belongsTo(User::class, 'borrower_id', 'id');
    }
    public function created_user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updated_user()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
