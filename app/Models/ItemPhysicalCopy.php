<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ItemPhysicalCopy extends Model
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
    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }
    public function item_type()
    {
        return $this->belongsTo(ItemType::class, 'item_type_code', 'code');
    }
    public function shelf_location()
    {
        return $this->belongsTo(Location::class, 'shelf_location_code', 'code');
    }
    public function library()
    {
        return $this->belongsTo(Library::class, 'library_id', 'id');
    }
    public function home_library()
    {
        return $this->belongsTo(Library::class, 'home_library_code', 'code');
    }
    public function current_library()
    {
        return $this->belongsTo(Library::class, 'current_library_code', 'code');
    }
}
