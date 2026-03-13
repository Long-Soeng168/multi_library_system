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
        Schema::table('item_main_categories_and_item_categories', function (Blueprint $table) {
            // 🔹 item_main_categories
            Schema::table('item_main_categories', function (Blueprint $table) {
                $table->foreignId('library_id')
                    ->nullable()
                    ->after('id');
            });

            // 🔹 item_categories
            Schema::table('item_categories', function (Blueprint $table) {
                $table->foreignId('library_id')
                    ->nullable()
                    ->after('id');
            });

            // Add foreign keys separately (safer)
            Schema::table('item_main_categories', function (Blueprint $table) {
                $table->foreign('library_id')
                    ->references('id')
                    ->on('libraries')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
            });

            Schema::table('item_categories', function (Blueprint $table) {
                $table->foreign('library_id')
                    ->references('id')
                    ->on('libraries')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_main_categories_and_item_categories', function (Blueprint $table) {
            Schema::table('item_main_categories', function (Blueprint $table) {
                $table->dropForeign(['library_id']);
                $table->dropColumn('library_id');
            });

            Schema::table('item_categories', function (Blueprint $table) {
                $table->dropForeign(['library_id']);
                $table->dropColumn('library_id');
            });
        });
    }
};
