<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
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
    public function category()
    {
        return $this->belongsTo(PostCategory::class, 'category_code', 'code');
    }
    public function type()
    {
        return $this->belongsTo(Type::class, 'type_code', 'code');
    }
    public function images()
    {
        return $this->hasMany(PostImage::class, 'post_id', 'id');
    }
    public function files()
    {
        return $this->hasMany(PostFile::class, 'post_id', 'id');
    }

    // Scope
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
