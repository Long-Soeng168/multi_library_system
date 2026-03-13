<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
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
    public function type()
    {
        return $this->belongsTo(Type::class, 'type_code', 'code');
    }
    public function children()
    {
        return $this->hasMany(Page::class, 'parent_code', 'code');
    }
    public function parent()
    {
        return $this->belongsTo(Page::class, 'parent_code', 'code');
    }
    public function images()
    {
        return $this->hasMany(PageImage::class, 'page_id', 'id');
    }

    /**
     * Flat collection of all parents (direct → root)
     */
    public function allParents()
    {
        $all = collect();
        $current = $this;

        while ($current->parent_code) {
            $parent = Page::where('code', $current->parent_code)->first();
            if (!$parent) break;
            $all->push($parent);
            $current = $parent;
        }

        return $all;
    }

    /**
     * Nested parent tree
     */
    public function parentTree()
    {
        $parent = Page::where('code', $this->parent_code)->first();

        if ($parent) {
            $parent->nested_parent = $parent->parentTree(); // avoid overwriting relation
            return $parent;
        }

        return null;
    }

    /**
     * Flat collection of all children (recursive)
     */
    public function allChildren()
    {
        $all = collect();

        foreach ($this->children()->get() as $child) {
            $all->push($child);
            $all = $all->merge($child->allChildren());
        }

        return $all;
    }

    /**
     * Nested children tree
     */
    public function childrenTree()
    {
        $children = $this->children()->get();

        foreach ($children as $child) {
            $child->nested_children = $child->childrenTree(); // avoid overwriting relation
        }

        return $children;
    }
}
