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
        Schema::table('user_categories', function (Blueprint $table) {
            $table->decimal('fine_amount_per_day', 8, 2)
                ->nullable();

            $table->decimal('max_fines_amount', 8, 2)
                ->nullable(); // max fine

            $table->integer('borrowing_limit')
                ->nullable();

            $table->integer('loan_period')
                ->nullable(); // days
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_categories', function (Blueprint $table) {
            $table->dropColumn([
                'fine_amount_per_day',
                'max_fines_amount',
                'borrowing_limit',
                'loan_period',
            ]);
        });
    }
};
