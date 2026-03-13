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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();

            $table->string('code')->nullable()->unique();
            $table->string('parent_code')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->string('name');
            $table->string('name_kh')->nullable();

            $table->text('short_description')->nullable();
            $table->text('short_description_kh')->nullable();

            $table->longText('long_description')->nullable();
            $table->longText('long_description_kh')->nullable();

            $table->string('type_code')->nullable(); // FK to types.code

            $table->string('button_title')->nullable();
            $table->string('button_title_kh')->nullable();

            $table->string('link')->nullable();
            $table->string('icon')->nullable();

            $table->unsignedBigInteger('total_views_count')->default(0);
            $table->integer('order_index')->default(100);

            $table->softDeletes();
            $table->timestamps();
        });

        // Add FKs after table exists
        Schema::table('pages', function (Blueprint $table) {
            $table->foreign('parent_code')
                ->references('code')->on('pages')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreign('type_code')
                ->references('code')->on('types')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreign('created_by')
                ->references('id')->on('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreign('updated_by')
                ->references('id')->on('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
