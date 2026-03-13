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
        Schema::table('item_physical_copies', function (Blueprint $table) {
            Schema::table('item_physical_copies', function (Blueprint $table) {
                $table->dropUnique(['barcode']);
                $table->unique(['barcode', 'library_id']);
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_physical_copies', function (Blueprint $table) {
            $table->dropUnique(['barcode', 'library_id']);
            $table->unique(['barcode']);
        });
    }
};
