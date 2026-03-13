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
        Schema::table('circulations_and_circulation_rules_tables', function (Blueprint $table) {
            Schema::table('circulations', function (Blueprint $table) {
                $table->foreignId('library_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('libraries')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
            });

            Schema::table('circulation_rules', function (Blueprint $table) {
                $table->foreignId('library_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('libraries')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('circulations_and_circulation_rules_tables', function (Blueprint $table) {
            Schema::table('circulations', function (Blueprint $table) {
                $table->dropForeign(['library_id']);
                $table->dropColumn('library_id');
            });

            Schema::table('circulation_rules', function (Blueprint $table) {
                $table->dropForeign(['library_id']);
                $table->dropColumn('library_id');
            });
        });
    }
};
