<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovieFeedback extends Model
{
    protected $fillable = ['user_id', 'movie_id', 'type', 'title', 'poster_path', 'genre', 'tmdb_rating'];
}
