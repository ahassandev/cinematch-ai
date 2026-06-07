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
        Schema::table('movie_feedback', function (Blueprint $table) {
            $table->string('title')->nullable()->after('movie_id');
            $table->string('poster_path')->nullable()->after('title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movie_feedback', function (Blueprint $table) {
            $table->dropColumn(['title', 'poster_path']);
        });
    }
};
