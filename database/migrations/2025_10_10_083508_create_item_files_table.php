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
        Schema::create('item_files', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('item_id');
            $table->string('file_name');
            $table->string('file_type');
            $table->string('label')->nullable();
            $table->string('label_kh')->nullable();
            $table->integer('order_index')->nullable();

            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_files');
    }
};
