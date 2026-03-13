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
        Schema::create('item_physical_copies', function (Blueprint $table) {
            $table->id();

            $table->foreignId('item_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('barcode')->unique()->index();
            $table->string('full_call_number')->nullable();
            $table->string('inventory_number')->nullable();

            $table->string('public_note')->nullable();
            $table->string('unpublic_note')->nullable();

            $table->string('shelf_location_code')->nullable();
            $table->string('item_type_code')->nullable();
            $table->string('home_library_code')->nullable();
            $table->string('current_library_code')->nullable();

            // Koha Status Flags (Authorized Values)
            $table->integer('not_for_loan')->default(0)->comment('0=Available, 1=Not for loan, etc.');
            $table->integer('item_lost')->default(0)->comment('0=Available, 1=Lost, 2=Long Overdue');
            $table->integer('withdrawn')->default(0)->comment('0=Active, 1=Withdrawn');
            $table->integer('damaged')->default(0)->comment('0=Active, 1=Damaged');

            $table->unsignedInteger('total_checkouts')->default(0);
            $table->timestamp('borrowed_at')->nullable();
            $table->timestamp('due_at')->nullable();
            $table->timestamp('last_borrowed_at')->nullable();
            $table->timestamp('last_seen_at')->nullable(); // For Simple Inventory

            $table->foreign('shelf_location_code')
                ->references('code')
                ->on('locations')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreign('item_type_code')
                ->references('code')
                ->on('item_types')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreign('home_library_code')
                ->references('code')
                ->on('libraries')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreign('current_library_code')
                ->references('code')
                ->on('libraries')
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
        Schema::dropIfExists('item_physical_copies');
    }
};
