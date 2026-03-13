<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Safely drop old single-column unique if exists
            DB::statement('ALTER TABLE users DROP INDEX IF EXISTS users_card_number_unique');

            // Add new composite unique index
            $table->unique(['card_number', 'library_id'], 'card_number_library_id_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop composite unique
            $table->dropUnique('card_number_library_id_unique');

            // Restore old single-column unique
            $table->unique('card_number', 'users_card_number_unique');
        });
    }
};
