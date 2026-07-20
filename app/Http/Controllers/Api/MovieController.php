<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TMDBService;
use App\Repositories\Interfaces\SearchHistoryRepositoryInterface;
use App\Repositories\Interfaces\WatchlistRepositoryInterface;
use App\Repositories\Interfaces\MovieFeedbackRepositoryInterface;
use App\DTOs\MovieCollectionDTO;
use App\DTOs\MovieDTO;

class MovieController extends Controller
{
    protected $tmdb;
    protected $searchHistoryRepo;
    protected $watchlistRepo;
    protected $feedbackRepo;

    public function __construct(
        TMDBService $tmdb,
        SearchHistoryRepositoryInterface $searchHistoryRepo,
        WatchlistRepositoryInterface $watchlistRepo,
        MovieFeedbackRepositoryInterface $feedbackRepo
    ) {
        $this->tmdb = $tmdb;
        $this->searchHistoryRepo = $searchHistoryRepo;
        $this->watchlistRepo = $watchlistRepo;
        $this->feedbackRepo = $feedbackRepo;
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        if (empty($query)) {
            return response()->json(['error' => 'Query is required'], 400);
        }

        if (auth()->check()) {
            $this->searchHistoryRepo->recordSearch(auth()->id(), $query);
        }

        $rawResults = $this->tmdb->searchMovies($query);
        $collectionDTO = MovieCollectionDTO::fromTMDBArray($rawResults);
        
        $this->applyUserInteractions($collectionDTO);

        return response()->json($collectionDTO);
    }

    public function popular()
    {
        $rawResults = $this->tmdb->getPopularMovies();
        $collectionDTO = MovieCollectionDTO::fromTMDBArray($rawResults);
        
        $this->applyUserInteractions($collectionDTO);

        return response()->json($collectionDTO);
    }

    public function details($id)
    {
        $results = $this->tmdb->getMovieDetails($id);
        // Returning raw for details as it has nested properties not in DTO
        return response()->json($results);
    }

    public function tvDetails($id)
    {
        $results = $this->tmdb->getTVDetails($id);
        return response()->json($results);
    }

    public function recommendations($id)
    {
        $rawResults = $this->tmdb->getRecommendations($id);
        $collectionDTO = MovieCollectionDTO::fromTMDBArray($rawResults);
        return response()->json($collectionDTO);
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

        $rawResults = $this->tmdb->discoverMovies($params);
        $collectionDTO = MovieCollectionDTO::fromTMDBArray($rawResults);
        
        return response()->json($collectionDTO);
    }

    public function getPersonalizedRecommendations(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            $popular = $this->tmdb->getPopularMovies();
            $collectionDTO = MovieCollectionDTO::fromTMDBArray($popular);
            return response()->json($collectionDTO);
        }

        $likedMovies = $this->feedbackRepo->getFeedbackByTypeAndUser($user->id, 'like')->take(5);
        $interactedMovieIds = $this->feedbackRepo->getFeedbackMapForMovies($user->id, [])->keys()->toArray(); // Needs actual fetching logic if required
        // Actually, just fetch all feedbacks for user
        $interactedMovieIds = \App\Models\MovieFeedback::where('user_id', $user->id)->pluck('movie_id')->toArray();

        if ($likedMovies->isEmpty()) {
            $popular = $this->tmdb->getPopularMovies();
            $collectionDTO = MovieCollectionDTO::fromTMDBArray($popular);
            
            // Add label using mapping
            foreach ($collectionDTO->results as $movie) {
                $movie->aiReason = 'popular';
                $movie->score = 70;
            }
            
            return response()->json($collectionDTO);
        }

        return $this->getAggregateRecommendations($likedMovies, $interactedMovieIds);
    }

    public function getMovieAIRecommendations($id)
    {
        $movie = (object)[
            'movie_id' => $id
        ];

        $interactedMovieIds = [];
        if (auth()->check()) {
            $interactedMovieIds = \App\Models\MovieFeedback::where('user_id', auth()->id())
                ->pluck('movie_id')
                ->toArray();
        }

        return $this->getAggregateRecommendations(collect([$movie]), $interactedMovieIds);
    }

    protected function getAggregateRecommendations($baseMovies, $excludeMovieIds = [])
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

            $director = collect($credits['crew'] ?? [])->firstWhere('job', 'Director');
            if ($director) {
                $likedDirectors[$director['id']] = $director['name'];
            }

            foreach ($details['genres'] ?? [] as $g) {
                $likedGenreIds[$g['id']] = $g['name'];
            }

            foreach ($keywords['keywords'] ?? [] as $kw) {
                $likedKeywordIds[$kw['id']] = $kw['name'];
            }
        }

        foreach ($likedDirectors as $did => $dname) {
            $directorMovies = $this->tmdb->discoverMovies(['with_crew' => $did]);
            foreach ($directorMovies['results'] ?? [] as $dm) {
                if ($baseMovies->contains('movie_id', $dm['id'])) continue;
                if (in_array($dm['id'], $excludeMovieIds)) continue;

                if (!isset($allRecs[$dm['id']])) {
                    $allRecs[$dm['id']] = $dm;
                    $allRecs[$dm['id']]['ai_director'] = $dname;
                    $allRecs[$dm['id']]['ai_reason'] = "director";
                    $allRecs[$dm['id']]['score'] = 98;
                }
            }
        }

        if (count($allRecs) < 12 && !empty($likedGenreIds)) {
            $discovery = $this->tmdb->discoverMovies([
                'with_genres' => implode(',', array_slice(array_keys($likedGenreIds), 0, 3)),
                'with_keywords' => implode('|', array_slice(array_keys($likedKeywordIds), 0, 3))
            ]);
            foreach ($discovery['results'] ?? [] as $dm) {
                if ($baseMovies->contains('movie_id', $dm['id'])) continue;
                if (in_array($dm['id'], $excludeMovieIds)) continue;

                if (!isset($allRecs[$dm['id']])) {
                    $allRecs[$dm['id']] = $dm;
                    $allRecs[$dm['id']]['ai_reason'] = "story";
                    $allRecs[$dm['id']]['score'] = 88;
                }
            }
        }

        if (count($allRecs) < 16) {
            foreach ($baseMovies as $movie) {
                $recs = $this->tmdb->getRecommendations($movie->movie_id);
                foreach ($recs['results'] ?? [] as $r) {
                    if ($baseMovies->contains('movie_id', $r['id'])) continue;
                    if (in_array($r['id'], $excludeMovieIds)) continue;

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

        $finalResults = $limitedRecs->map(function($rec) {
            if (!isset($rec['ai_director'])) {
                $credits = $this->tmdb->getMovieCredits($rec['id']);
                $director = collect($credits['crew'] ?? [])->firstWhere('job', 'Director');
                $rec['ai_director'] = $director ? $director['name'] : null;
            }
            return MovieDTO::fromTMDBArray($rec); // Returns DTO instead of Array
        });

        // Wrap the finalResults in a MovieCollectionDTO
        return response()->json(new MovieCollectionDTO($finalResults->toArray()));
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
        
        $collectionDTO = MovieCollectionDTO::fromTMDBArray($data);
        return response()->json($collectionDTO);
    }
    
    /**
     * Applies interactions to a collection of movies
     */
    protected function applyUserInteractions(MovieCollectionDTO $collectionDTO): void
    {
        if (auth()->check() && count($collectionDTO->results) > 0) {
            $userId = auth()->id();
            $movieIds = array_map(fn($m) => $m->id, $collectionDTO->results);
            
            $watchlistIds = $this->watchlistRepo->getMovieIdsByUser($userId, $movieIds);
            $feedbackMap = $this->feedbackRepo->getFeedbackMapForMovies($userId, $movieIds);

            foreach ($collectionDTO->results as $movie) {
                $movie->inWatchlist = in_array($movie->id, $watchlistIds);
                $movie->isLiked = isset($feedbackMap[$movie->id]) && $feedbackMap[$movie->id]->type === 'like';
                $movie->isDisliked = isset($feedbackMap[$movie->id]) && $feedbackMap[$movie->id]->type === 'dislike';
            }
        }
    }
}
