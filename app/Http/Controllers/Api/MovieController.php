<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TMDBService;
use App\Models\SearchHistory;

class MovieController extends Controller
{
    protected $tmdb;

    public function __construct(TMDBService $tmdb)
    {
        $this->tmdb = $tmdb;
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        
        if (empty($query)) {
            return response()->json(['error' => 'Query is required'], 400);
        }

        // Save search history if user is logged in
        if (auth()->check()) {
            SearchHistory::create([
                'user_id' => auth()->id(),
                'query' => $query
            ]);
        }

        $results = $this->tmdb->searchMovies($query);
        return response()->json($results);
    }

    public function popular()
    {
        $results = $this->tmdb->getPopularMovies();
        return response()->json($results);
    }

    public function details($id)
    {
        $results = $this->tmdb->getMovieDetails($id);
        return response()->json($results);
    }

    public function tvDetails($id)
    {
        $results = $this->tmdb->getTVDetails($id);
        return response()->json($results);
    }

    public function recommendations($id)
    {
        $results = $this->tmdb->getRecommendations($id);
        return response()->json($results);
    }

    public function genres()
    {
        $results = $this->tmdb->getGenres();
        return response()->json($results);
    }

    public function discover(Request $request)
    {
        $params = [];

        if ($request->filled('with_genres')) {
            $params['with_genres'] = $request->input('with_genres');
        }

        if ($request->filled('primary_release_year')) {
            $params['primary_release_year'] = $request->input('primary_release_year');
        }

        if ($request->filled('vote_average_gte')) {
            $params['vote_average.gte'] = $request->input('vote_average_gte');
        }

        $results = $this->tmdb->discoverMovies($params);
        return response()->json($results);
    }
}
