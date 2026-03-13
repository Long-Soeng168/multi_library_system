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
        Schema::table('libraries', function (Blueprint $table) {
            $table->string('email')->after('name_kh')->nullable();
            $table->string('phone')->after('email')->nullable();
            $table->string('website_url')->after('phone')->nullable();
            $table->string('banner')->after('image')->nullable();

            $table->text('map_link')->after('address')->nullable();

            // Operational
            $table->text('opening_hours')->after('map_link')->nullable();
            $table->string('opening_days')->after('opening_hours')->nullable();

            // Status and Ownership
            $table->string('status')->after('opening_days')->default('in_review');

            $table->foreignId('owner_id')
                ->after('status')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('libraries', function (Blueprint $table) {
            // 1. Drop the Foreign Key first
            $table->dropForeign(['owner_id']);

            // 2. Drop the rest of the columns
            $table->dropColumn([
                'email',
                'phone',
                'website_url',
                'banner',
                'map_link',
                'opening_hours',
                'opening_days',
                'status',
                'owner_id'
            ]);
        });
    }
};
