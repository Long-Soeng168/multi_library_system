<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemAuthor extends Model
{
    protected $guarded = [];

    public function authoredItems()
    {
        return $this->belongsToMany(Item::class, 'item_authors', 'author_id', 'item_id')->withTimestamps();
    }
}
