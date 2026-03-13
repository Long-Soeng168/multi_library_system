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
        Schema::create('circulation_rules', function (Blueprint $table) {
            $table->id();

            $table->decimal('fine_amount_per_day', 8, 2)->default(500);
            $table->decimal('max_fines_amount', 8, 2)->default(50000); //Max amount that we can fine
            $table->integer('borrowing_limit')->default(2);
            $table->integer('loan_period')->default(14); //14 days

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('circulation_rules');
    }
};
