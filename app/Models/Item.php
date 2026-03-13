<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
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
    public function authors()
    {
        return $this->belongsToMany(User::class, 'item_authors', 'item_id', 'author_id')->withTimestamps();
    }
    public function publisher()
    {
        return $this->belongsTo(User::class, 'publisher_id', 'id');
    }
    public function advisor()
    {
        return $this->belongsTo(User::class, 'advisor_id', 'id');
    }
    public function language()
    {
        return $this->belongsTo(Language::class, 'language_code', 'code');
    }
    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_code', 'code');
    }
    public function file_type()
    {
        return $this->belongsTo(Type::class, 'file_type_code', 'code');
    }
    public function images()
    {
        return $this->hasMany(ItemImage::class, 'item_id', 'id');
    }
    public function physical_copies()
    {
        return $this->hasMany(ItemPhysicalCopy::class, 'item_id', 'id');
    }



    public function files()
    {
        return $this->hasMany(ItemFile::class, 'item_id', 'id');
    }

    // Scope
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
