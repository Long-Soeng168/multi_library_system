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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();

            $table->string('name'); // Free, Pro, Enterprise
            $table->string('name_kh')->nullable();
            $table->decimal('price', 10, 2)->default(0);

            $table->enum('billing_cycle', ['monthly', 'yearly'])->default('yearly');
            $table->string('billing_cycle_label')->nullable();
            $table->string('billing_cycle_label_kh')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->integer('order_index')->nullable()->default(100);
            $table->string('button_label')->nullable();
            $table->string('button_label_kh')->nullable();
            $table->string('action_url')->nullable();

            // Limits
            $table->integer('max_books')->default(0); // -1 = unlimited
            $table->integer('max_members')->default(0);
            $table->integer('max_storage_mb')->default(0);

            // Extra features (flexible)
            $table->json('features')->nullable();

            $table->text('short_description')->nullable();
            $table->text('short_description_kh')->nullable();
            $table->longText('long_description')->nullable();
            $table->longText('long_description_kh')->nullable();

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
        Schema::dropIfExists('plans');
    }
};
