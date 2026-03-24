<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscription extends Model
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
    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_id', 'id');
    }
    public function library()
    {
        return $this->belongsTo(Library::class, 'library_id', 'id');
    }
}
