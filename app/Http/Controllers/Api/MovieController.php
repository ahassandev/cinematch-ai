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

    public function getPersonalizedRecommendations(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            $popular = $this->tmdb->getPopularMovies();
            return response()->json($popular);
        }

        $favorites = \App\Models\Favorite::where('user_id', $user->id)->latest()->take(5)->get();
        
        if ($favorites->isEmpty()) {
            $popular = $this->tmdb->getPopularMovies();
            $results = collect($popular['results'])->map(function($r) {
                $r['ai_reason'] = "Popular Pick";
                return $r;
            });
            return response()->json(['results' => $results]);
        }

        return $this->getAggregateRecommendations($favorites);
    }

    public function getMovieAIRecommendations($id)
    {
        $movie = (object)[
            'movie_id' => $id
        ];
        
        return $this->getAggregateRecommendations(collect([$movie]));
    }

    protected function getAggregateRecommendations($baseMovies)
    {
        $allRecs = [];
        $likedDirectors = [];

        foreach ($baseMovies as $movie) {
            $recs = $this->tmdb->getRecommendations($movie->movie_id);
            $credits = $this->tmdb->getMovieCredits($movie->movie_id);
            
            // Collect directors of movies the user likes
            $director = collect($credits['crew'] ?? [])->firstWhere('job', 'Director');
            if ($director) {
                $likedDirectors[] = $director['name'];
            }

            if (isset($recs['results'])) {
                foreach ($recs['results'] as $r) {
                    $recId = $r['id'];
                    if (!isset($allRecs[$recId])) {
                        $allRecs[$recId] = $r;
                        $allRecs[$recId]['score'] = 10; // Base score for being a recommendation
                    } else {
                        $allRecs[$recId]['score'] += 10; // Bonus for being recommended by multiple liked movies
                    }
                }
            }
        }

        // Apply director-based bonus
        foreach ($allRecs as &$rec) {
            $recCredits = $this->tmdb->getMovieCredits($rec['id']);
            $recDirector = collect($recCredits['crew'] ?? [])->firstWhere('job', 'Director');
            
            if ($recDirector && in_array($recDirector['name'], $likedDirectors)) {
                $rec['score'] += 50; // Massively boost movies by the same director
                $rec['ai_reason'] = "Directed by " . $recDirector['name'];
            }
        }

        // Sort by score
        $sortedRecs = collect($allRecs)
            ->sortByDesc('score')
            ->take(20)
            ->values();

        return response()->json(['results' => $sortedRecs]);
    }

    public function getTrending(Request $request)
    {
        $timeWindow = $request->input('period', 'day');
        $type = $request->input('type', 'trending');

        if ($type === 'top_rated') {
            $data = $this->tmdb->getTopRatedMovies();
        } else {
            $data = $this->tmdb->getTrendingMovies($timeWindow);
        }

        return response()->json($data);
    }
}
