<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ItemMainCategory extends Model
{
    use SoftDeletes;
    protected $guarded = [];

    public function library()
    {
        return $this->belongsTo(Library::class, 'library_id', 'id');
    }

    public function created_user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updated_user()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
    public function categories()
    {
        return $this->belongsTo(ItemCategory::class, 'item_main_category_code', 'code');
    }
    public function items()
    {
        return $this->hasMany(Item::class, 'main_category_code', 'code');
    }
}
