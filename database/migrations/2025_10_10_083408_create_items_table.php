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
        Schema::create('items', function (Blueprint $table) {
            $table->id();

            $table->string('name', 500)->nullable();
            $table->string('name_kh', 500)->nullable();
            $table->text('short_description')->nullable();
            $table->text('short_description_kh')->nullable();
            $table->longText('long_description')->nullable();
            $table->longText('long_description_kh')->nullable();
            $table->string('keywords', 500)->nullable();
            $table->string('status')->nullable();
            $table->string('external_link')->nullable()->comment('For Resource use Youtube Video URL.');
            $table->string('language_code')->nullable();
            $table->string('file_type_code')->nullable();
            $table->unsignedInteger('total_view_count')->default(0);
            $table->unsignedInteger('total_read_count')->default(0);
            $table->unsignedInteger('total_download_count')->default(0);
            $table->unsignedInteger('total_page')->nullable();

            $table->string('thumbnail')->nullable();
            $table->string('file_name')->nullable();

            $table->string('category_code')->nullable();
            $table->foreign('category_code')
                ->references('code')
                ->on('item_categories')
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

            $table->string('ddc')->nullable();
            $table->string('lcc')->nullable();
            $table->string('isbn')->nullable();
            $table->string('eisbn')->nullable();
            $table->string('doi')->nullable();
            $table->string('author_name')->nullable()->comment('For free type author name.');
            $table->string('institution')->nullable()->comment('For institution that student go to internship.');
            $table->integer('batch')->nullable()->comment('Year of graduation. e.g., the 5th group of students to ever attend');

            $table->year('published_year')->nullable();
            $table->unsignedTinyInteger('published_month')->nullable(); // 1–12
            $table->unsignedTinyInteger('published_day')->nullable();   // 1–31

            $table->foreignId('publisher_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreignId('advisor_id')
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
        Schema::dropIfExists('items');
    }
};
