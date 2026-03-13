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
        Schema::table('website_infos', function (Blueprint $table) {
            $table->string('primary_color')->nullable()->after('id');
            $table->string('primary_foreground_color')->nullable()->after('primary_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('website_infos', function (Blueprint $table) {
            $table->dropColumn(['primary_color', 'primary_foreground_color']);
        });
    }
};
