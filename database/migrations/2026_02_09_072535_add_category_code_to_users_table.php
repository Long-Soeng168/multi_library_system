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
            $table->string('card_number')
                ->unique()
                ->nullable()
                ->after('id');

            $table->date('expired_at')
                ->nullable()
                ->after('card_number');

            $table->string('category_code')
                ->nullable()
                ->after('card_number');

            $table->foreign('category_code')
                ->references('code')
                ->on('user_categories')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['category_code']);
            $table->dropUnique(['card_number']);
            $table->dropColumn([
                'card_number',
                'expired_at',
                'category_code',
            ]);
        });
    }
};
