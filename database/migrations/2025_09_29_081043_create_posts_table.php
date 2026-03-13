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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            $table->string('title')->nullable();
            $table->string('title_kh')->nullable();
            $table->text('short_description')->nullable();
            $table->text('short_description_kh')->nullable();
            $table->longText('long_description')->nullable();
            $table->longText('long_description_kh')->nullable();
            $table->string('keywords', 500)->nullable();
            $table->string('status')->nullable();
            $table->string('external_link')->nullable();
            $table->string('language_code')->nullable();
            $table->string('type_code')->nullable();
            $table->unsignedInteger('total_view_count')->default(0);
            $table->string('thumbnail')->nullable();
            $table->string('banner')->nullable();
            
            $table->string('category_code')->nullable();
            $table->foreign('category_code')
                ->references('code')
                ->on('post_categories')
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
        Schema::dropIfExists('posts');
    }
};
