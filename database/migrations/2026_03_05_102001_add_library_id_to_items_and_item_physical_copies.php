<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('items_and_item_physical_copies', function (Blueprint $table) {
            Schema::table('items', function (Blueprint $table) {
                $table->foreignId('library_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('libraries')
                    ->restrictOnDelete();
            });

            Schema::table('item_physical_copies', function (Blueprint $table) {
                $table->foreignId('library_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('libraries')
                    ->restrictOnDelete();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items_and_item_physical_copies', function (Blueprint $table) {
            Schema::table('items', function (Blueprint $table) {
                $table->dropForeign(['library_id']);
                $table->dropColumn('library_id');
            });

            Schema::table('item_physical_copies', function (Blueprint $table) {
                $table->dropForeign(['library_id']);
                $table->dropColumn('library_id');
            });
        });
    }
};
