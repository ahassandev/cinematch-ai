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
        
        if (auth()->check() && isset($results['results'])) {
            $userId = auth()->id();
            $movieIds = collect($results['results'])->pluck('id');
            
            $watchlistIds = \App\Models\Watchlist::where('user_id', $userId)
                ->whereIn('movie_id', $movieIds)
                ->pluck('movie_id')
                ->toArray();
                
            $feedback = \App\Models\MovieFeedback::where('user_id', $userId)
                ->whereIn('movie_id', $movieIds)
                ->get()
                ->keyBy('movie_id');

            foreach ($results['results'] as &$movie) {
                $movie['in_watchlist'] = in_array($movie['id'], $watchlistIds);
                $movie['is_liked'] = isset($feedback[$movie['id']]) && $feedback[$movie['id']]->type === 'like';
                $movie['is_disliked'] = isset($feedback[$movie['id']]) && $feedback[$movie['id']]->type === 'dislike';
            }
        }

        return response()->json($results);
    }

    public function popular()
    {
        $results = $this->tmdb->getPopularMovies();

        if (auth()->check() && isset($results['results'])) {
            $userId = auth()->id();
            $movieIds = collect($results['results'])->pluck('id');
            
            $watchlistIds = \App\Models\Watchlist::where('user_id', $userId)
                ->whereIn('movie_id', $movieIds)
                ->pluck('movie_id')
                ->toArray();
                
            $feedback = \App\Models\MovieFeedback::where('user_id', $userId)
                ->whereIn('movie_id', $movieIds)
                ->get()
                ->keyBy('movie_id');

            foreach ($results['results'] as &$movie) {
                $movie['in_watchlist'] = in_array($movie['id'], $watchlistIds);
                $movie['is_liked'] = isset($feedback[$movie['id']]) && $feedback[$movie['id']]->type === 'like';
                $movie['is_disliked'] = isset($feedback[$movie['id']]) && $feedback[$movie['id']]->type === 'dislike';
            }
        }

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

        // No user — return popular movies
        if (!$user) {
            $popular = $this->tmdb->getPopularMovies();
            return response()->json($popular);
        }

        // Get last 5 liked movies
        $likedMovies = \App\Models\MovieFeedback::where('user_id', $user->id)
            ->where('type', 'like')
            ->latest()
            ->take(5)
            ->get();

        // No likes yet — return popular movies with label
        if ($likedMovies->isEmpty()) {
            $popular = $this->tmdb->getPopularMovies();
            $results = collect($popular['results'] ?? [])->map(function ($r) {
                $r['ai_reason'] = 'popular';
                $r['score'] = 70;
                return $r;
            });
            return response()->json(['results' => $results]);
        }

        return $this->getAggregateRecommendations($likedMovies);
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
        $likedGenreIds = [];
        $likedKeywordIds = [];

        foreach ($baseMovies as $movie) {
            $details = $this->tmdb->getMovieDetails($movie->movie_id);
            if (!$details) continue;

            $credits = $this->tmdb->getMovieCredits($movie->movie_id);
            $keywords = $this->tmdb->getMovieKeywords($movie->movie_id);

            // Director
            $director = collect($credits['crew'] ?? [])->firstWhere('job', 'Director');
            if ($director) {
                $likedDirectors[$director['id']] = $director['name'];
            }

            // Genres
            foreach ($details['genres'] ?? [] as $g) {
                $likedGenreIds[$g['id']] = $g['name'];
            }

            // Keywords (Storyline)
            foreach ($keywords['keywords'] ?? [] as $kw) {
                $likedKeywordIds[$kw['id']] = $kw['name'];
            }
        }

        // Now that we have all directors, genres, and keywords from all base movies, make the discovery calls ONCE per item
        
        // --- Priority 1: Same Director ---
        foreach ($likedDirectors as $did => $dname) {
            $directorMovies = $this->tmdb->discoverMovies(['with_crew' => $did]);
            foreach ($directorMovies['results'] ?? [] as $dm) {
                // Skip if it's already one of the base movies
                if ($baseMovies->contains('movie_id', $dm['id'])) continue;

                if (!isset($allRecs[$dm['id']])) {
                    $allRecs[$dm['id']] = $dm;
                    $allRecs[$dm['id']]['ai_director'] = $dname;
                    $allRecs[$dm['id']]['ai_reason'] = "director";
                    $allRecs[$dm['id']]['score'] = 98;
                }
            }
        }

        // --- Priority 2: Same Genre + Keywords (Storyline) ---
        if (count($allRecs) < 12 && !empty($likedGenreIds)) {
            $discovery = $this->tmdb->discoverMovies([
                'with_genres' => implode(',', array_slice(array_keys($likedGenreIds), 0, 3)),
                'with_keywords' => implode('|', array_slice(array_keys($likedKeywordIds), 0, 3))
            ]);
            foreach ($discovery['results'] ?? [] as $dm) {
                if ($baseMovies->contains('movie_id', $dm['id'])) continue;

                if (!isset($allRecs[$dm['id']])) {
                    $allRecs[$dm['id']] = $dm;
                    $allRecs[$dm['id']]['ai_reason'] = "story";
                    $allRecs[$dm['id']]['score'] = 88;
                }
            }
        }

        // --- Priority 3: Fallback (TMDB recommendations) ---
        if (count($allRecs) < 16) {
            foreach ($baseMovies as $movie) {
                $recs = $this->tmdb->getRecommendations($movie->movie_id);
                foreach ($recs['results'] ?? [] as $r) {
                    if ($baseMovies->contains('movie_id', $r['id'])) continue;

                    if (!isset($allRecs[$r['id']])) {
                        $allRecs[$r['id']] = $r;
                        $allRecs[$r['id']]['ai_reason'] = "type"; 
                        $allRecs[$r['id']]['score'] = 78;
                    }
                }
            }
        }

        $genreMap = [
            28 => 'Action', 12 => 'Adventure', 16 => 'Animation', 35 => 'Comedy', 80 => 'Crime',
            99 => 'Documentary', 18 => 'Drama', 10751 => 'Family', 14 => 'Fantasy', 36 => 'History',
            27 => 'Horror', 10402 => 'Music', 9648 => 'Mystery', 10749 => 'Romance', 878 => 'Sci-Fi',
            10770 => 'TV Movie', 53 => 'Thriller', 10752 => 'War', 37 => 'Western',
        ];

        foreach ($allRecs as &$rec) {
            $rec['ai_genre_name'] = isset($rec['genre_ids'][0]) ? ($genreMap[$rec['genre_ids'][0]] ?? 'Movie') : 'Movie';
            $rec['ai_description'] = isset($rec['overview']) ? mb_strimwidth($rec['overview'], 0, 110, '...') : '';
        }

        $limitedRecs = collect($allRecs)->sortByDesc('score')->values()->take(12);

        // Fetch director for each of the limited recommendations if not already present
        $finalResults = $limitedRecs->map(function($rec) {
            if (!isset($rec['ai_director'])) {
                $credits = $this->tmdb->getMovieCredits($rec['id']);
                $director = collect($credits['crew'] ?? [])->firstWhere('job', 'Director');
                $rec['ai_director'] = $director ? $director['name'] : null;
            }
            return $rec;
        });

        return response()->json([
            'results' => $finalResults
        ]);
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
