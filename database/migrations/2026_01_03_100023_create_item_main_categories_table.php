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
        Schema::create('item_main_categories', function (Blueprint $table) {
            $table->id();

            $table->string('code')->unique();
            $table->string('name');
            $table->string('name_kh')->nullable();
            $table->text('short_description')->nullable();
            $table->text('short_description_kh')->nullable();
            $table->string('image')->nullable();
            $table->string('banner')->nullable();
            $table->integer('order_index')->default(1000);

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

        Schema::table('item_categories', function (Blueprint $table) {
            $table->string('item_main_category_code')->nullable()->after('code');

            $table->foreign('item_main_category_code')
                ->references('code')
                ->on('item_main_categories')
                ->cascadeOnUpdate()
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_categories', function (Blueprint $table) {
            $table->dropForeign(['item_main_category_code']);
            $table->dropColumn(['item_main_category_code']);
        });

        Schema::dropIfExists('item_main_categories');
    }
};
