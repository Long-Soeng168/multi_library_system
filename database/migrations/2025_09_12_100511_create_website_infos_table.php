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
        Schema::create('website_infos', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('name_kh')->nullable();

            $table->text('short_description')->nullable();
            $table->text('short_description_kh')->nullable();

            $table->text('keywords')->nullable();
            $table->text('keywords_kh')->nullable();

            $table->string('address')->nullable();
            $table->string('address_kh')->nullable();

            $table->text('google_map_embed')->nullable();

            $table->string('phone')->nullable();
            $table->string('email')->nullable();

            $table->string('working_hours')->nullable();
            $table->string('working_hours_kh')->nullable();

            $table->string('working_days')->nullable();
            $table->string('working_days_kh')->nullable();

            $table->string('copyright')->nullable();
            $table->string('copyright_kh')->nullable();

            $table->string('logo')->nullable();
            $table->string('logo_darkmode')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_infos');
    }
};
