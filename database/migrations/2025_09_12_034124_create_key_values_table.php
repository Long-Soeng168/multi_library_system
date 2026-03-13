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
        Schema::create('key_values', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->string('name');
            $table->string('name_kh')->nullable();
            $table->string('value')->nullable(); // varbinary
            $table->text('short_description')->nullable();
            $table->text('short_description_kh')->nullable();
            $table->string('type_code')->nullable(); // FK to types.code
            $table->string('image')->nullable(); // FK to types.code
            $table->integer('order_index')->default(100);

            // Foreign keys
            $table->foreign('type_code')
                ->references('code')
                ->on('types')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreign('updated_by')
                ->references('id')
                ->on('users')
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
        Schema::dropIfExists('key_values');
    }
};
