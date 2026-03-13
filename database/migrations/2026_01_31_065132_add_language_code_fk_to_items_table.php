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
        Schema::table('items', function (Blueprint $table) {
            // make sure type matches languages.code
            $table->string('language_code')->change();

            $table->foreign('language_code')
                ->references('code')
                ->on('languages')
                ->cascadeOnUpdate()
                ->restrictOnDelete(); // change if needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropForeign(['language_code']);
        });
    }
};
