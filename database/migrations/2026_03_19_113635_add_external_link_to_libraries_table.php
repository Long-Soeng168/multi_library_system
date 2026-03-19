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
        Schema::table('libraries', function (Blueprint $table) {
            Schema::table('libraries', function (Blueprint $table) {
                $table->string('external_link')->nullable()->after('name'); // change position if needed
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('libraries', function (Blueprint $table) {
            Schema::table('libraries', function (Blueprint $table) {
                $table->dropColumn('external_link');
            });
        });
    }
};
