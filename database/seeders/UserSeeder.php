<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $created_user = User::firstOrCreate(
            ['email' => 'developer@gmail.com'], // lookup condition
            [
                'name' => 'Web Developer',
                'password' => Hash::make('developer@123'),
            ]
        );

        $created_user->syncRoles('Super Admin');
    }
}
