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
        Schema::create('banners', function (Blueprint $table) {
            $table->id();

            $table->string('type_code')->nullable(); // FK to types.code

            $table->string('name');
            $table->string('name_kh')->nullable();

            $table->text('short_description')->nullable();
            $table->text('short_description_kh')->nullable();

            $table->longText('long_description')->nullable();
            $table->longText('long_description_kh')->nullable();

            $table->string('button_title')->nullable();
            $table->string('button_title_kh')->nullable();
            $table->string('button_icon')->nullable();

            $table->string('link')->nullable();
            $table->string('image')->nullable();

            $table->integer('order_index')->default(100);

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

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
        Schema::dropIfExists('banners');
    }
};
