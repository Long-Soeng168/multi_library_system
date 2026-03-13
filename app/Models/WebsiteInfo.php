<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteInfo extends Model
{
    protected $guarded = [];

    public function created_user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updated_user()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
