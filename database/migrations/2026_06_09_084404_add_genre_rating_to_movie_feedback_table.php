<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('movie_feedback', function (Blueprint $table) {
            $table->string('genre')->nullable()->after('poster_path');
            $table->decimal('tmdb_rating', 4, 1)->nullable()->after('genre');
        });
    }

    public function down(): void
    {
        Schema::table('movie_feedback', function (Blueprint $table) {
            $table->dropColumn(['genre', 'tmdb_rating']);
        });
    }
};
