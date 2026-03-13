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
        Schema::create('user_categories', function (Blueprint $table) {
            $table->id();

            $table->string('code')->unique(); // e.g., 'STU', 'TEA', 'STAFF'
            $table->string('name'); // e.g., 'Student', 'Teacher', 'Staff'
            $table->string('name_kh')->nullable();
            $table->string('user_category_type_code')->nullable(); // e.g., 'Institutional', 'Individual', 'Adult', 'Child'
            $table->integer('enrollment_period_months')->default(12); // Duration of membership in months
            $table->decimal('enrollment_fee', 8, 2)->default(4000);
            $table->integer('order_index')->default(100);

            $table->foreign('user_category_type_code')
                ->references('code')
                ->on('types')
                ->cascadeOnUpdate()
                ->nullOnDelete();

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
        Schema::dropIfExists('user_categories');
    }
};
