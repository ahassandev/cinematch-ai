<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Watchlist extends Model
{
    protected $fillable = ['user_id', 'movie_id', 'title', 'poster_path', 'genre', 'rating', 'year'];
}
