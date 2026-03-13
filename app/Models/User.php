<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasRoles;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'telegram_id',
        'photo_url',
        'name',
        'email',
        'phone',
        'address',
        'gender',
        'image',
        'created_by',
        'updated_by',
        'password',

        'name_kh',
        'card_number',
        'expired_at',
        'title_type_code',
        'category_code',
        'total_active_loan',
        'library_id',
        'library_role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function library()
    {
        return $this->belongsTo(Library::class, 'library_id', 'id');
    }
    public function created_user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function title()
    {
        return $this->belongsTo(Type::class, 'title_type_code', 'code');
    }
    public function category()
    {
        return $this->belongsTo(UserCategory::class, 'category_code', 'code');
    }
    public function updated_user()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
    public function publisher_items()
    {
        return $this->hasMany(Item::class, 'publisher_id', 'id');
    }
    public function advisor_items()
    {
        return $this->hasMany(Item::class, 'advisor_id', 'id');
    }
    public function posts()
    {
        return $this->hasMany(Post::class, 'created_by', 'id');
    }
    public function circulation_histories()
    {
        return $this->hasMany(Circulation::class, 'borrower_id', 'id');
    }

    public function author_items()
    {
        return $this->belongsToMany(Item::class, 'item_authors', 'author_id', 'item_id')
            ->withTimestamps();
    }


    // Reusable search scope
    public function scopeSearch($query, $search, array $fields = ['name'])
    {
        if ($search) {
            $query->where(function ($sub_query) use ($search, $fields) {
                foreach ($fields as $field) {
                    $sub_query->orWhere($field, 'LIKE', "%{$search}%");
                }
            });
        }

        return $query;
    }

    // Reusable sort scope
    public function scopeSort($query, $sortBy = 'id', $sortDirection = 'desc')
    {
        return $query->orderBy($sortBy, $sortDirection);
    }
}
