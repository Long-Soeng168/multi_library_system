<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Type extends Model
{
    use SoftDeletes;
    protected $guarded = [];

    public function created_user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updated_user()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }

     
    public function file_type_items()
    {
        return $this->hasMany(Item::class, 'file_type_code', 'code');
    }
    public function scopeGroup($query, string $groupCode)
    {
        return $query->where('group_code', $groupCode)
            ->orderBy('order_index')
            ->orderBy('name');
    }
}
