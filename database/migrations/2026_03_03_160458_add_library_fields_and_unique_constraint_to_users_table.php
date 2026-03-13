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
        Schema::table('users', function (Blueprint $table) {
            // 1. Add Library Relationship & Role
            $table->foreignId('library_id')
                ->after('id')
                ->nullable()
                ->constrained('libraries')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('library_role')
                ->after('library_id')
                ->nullable()
                ->default(null)
                ->comment(`options: owner, staff, borrower`);

            // 2. Handle Unique Constraints
            // We drop the old unique index on card_number
            $table->dropUnique(['card_number']);

            // We create a new composite unique index (Card + Library)
            // This allows Card "001" to exist in Library A and Library B
            $table->unique(['card_number', 'library_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // 1. Reverse the Unique Constraints
            $table->dropUnique(['card_number', 'library_id']);
            $table->unique(['card_number']);

            // 2. Drop Foreign Key and Columns
            $table->dropForeign(['library_id']);
            $table->dropColumn(['library_id', 'library_role']);
        });
    }
};
