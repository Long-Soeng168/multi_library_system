<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ItemCategory extends Model
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
    public function parent()
    {
        return $this->belongsTo(ItemCategory::class, 'parent_id', 'id');
    }
    public function items()
    {
        return $this->hasMany(Item::class, 'category_code', 'code');
    }

    public function children()
    {
        return $this->hasMany(ItemCategory::class, 'parent_id', 'id');
    }

    // Recursive flat list of all children
    public function allChildren()
    {
        $all = collect();

        // Use ->get() to make sure children are loaded
        foreach ($this->children()->get() as $child) {
            $all->push($child);
            $all = $all->merge($child->allChildren());
        }

        return $all;
    }

    // Nested tree
    public function childrenTree()
    {
        $children = $this->children()->get();

        foreach ($children as $child) {
            $child->children = $child->childrenTree();
        }

        return $children;
    }

    // Recursive flat list of all parents
    public function allParents()
    {
        $all = collect();

        // Load parent safely
        $parent = $this->parent()->first();
        if ($parent) {
            $all->push($parent);
            $all = $all->merge($parent->allParents());
        }

        return $all;
    }

    // Nested tree upward
    public function parentTree()
    {
        $parent = $this->parent()->first();

        if ($parent) {
            $parent->parent = $parent->parentTree();
            return $parent;
        }

        return null;
    }
}
