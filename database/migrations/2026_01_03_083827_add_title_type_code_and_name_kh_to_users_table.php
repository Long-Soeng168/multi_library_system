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
        Schema::table('users', function (Blueprint $table) {
            $table->string('name_kh')->nullable()->after('name');
            $table->string('title_type_code')->nullable()->after('name_kh')->comment('Mr, Ms, Dr, Prof, ...');

            $table->foreign('title_type_code')
                ->references('code')
                ->on('types')
                ->cascadeOnUpdate()
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['title_type_code']);
            $table->dropColumn(['title_type_code', 'name_kh']);
        });
    }
};
