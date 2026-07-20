<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Interfaces\WatchlistRepositoryInterface;
use App\Repositories\Interfaces\FavoriteRepositoryInterface;
use App\Repositories\Interfaces\SearchHistoryRepositoryInterface;
use App\Repositories\Interfaces\MovieFeedbackRepositoryInterface;
use App\Services\TMDBService;
use Illuminate\Support\Facades\Log;

class UserActivityController extends Controller
{
    protected $watchlistRepo;
    protected $favoriteRepo;
    protected $searchHistoryRepo;
    protected $feedbackRepo;
    protected $tmdb;

    public function __construct(
        WatchlistRepositoryInterface $watchlistRepo,
        FavoriteRepositoryInterface $favoriteRepo,
        SearchHistoryRepositoryInterface $searchHistoryRepo,
        MovieFeedbackRepositoryInterface $feedbackRepo,
        TMDBService $tmdb
    ) {
        $this->watchlistRepo = $watchlistRepo;
        $this->favoriteRepo = $favoriteRepo;
        $this->searchHistoryRepo = $searchHistoryRepo;
        $this->feedbackRepo = $feedbackRepo;
        $this->tmdb = $tmdb;
    }

    public function dashboard(Request $request)
    {
        $userId = auth()->id();

        $stats = [
            'searches' => $this->searchHistoryRepo->countByUserId($userId),
            'watchlists' => $this->watchlistRepo->countByUserId($userId),
            'favorites' => $this->favoriteRepo->countByUserId($userId),
            'recent_searches' => $this->searchHistoryRepo->getRecentSearches($userId),
            'recent_watchlists' => $this->watchlistRepo->getLatestByUserId($userId, 5),
        ];

        return response()->json($stats);
    }

    public function toggleWatchlist(Request $request)
    {
        $request->validate([
            'movie_id' => 'required',
            'title' => 'required',
            'poster_path' => 'nullable',
            'genre' => 'nullable',
            'rating' => 'nullable',
            'year' => 'nullable'
        ]);

        $result = $this->watchlistRepo->toggle(auth()->id(), $request->all());
        return response()->json($result);
    }

    public function toggleFavorite(Request $request)
    {
        $request->validate([
            'movie_id' => 'required',
            'title' => 'required',
            'poster_path' => 'nullable',
        ]);

        $result = $this->favoriteRepo->toggle(auth()->id(), $request->all());
        return response()->json($result);
    }

    public function leaveFeedback(Request $request)
    {
        $request->validate([
            'movie_id'    => 'required',
            'type'        => 'required|in:like,dislike',
            'title'       => 'nullable|string',
            'poster_path' => 'nullable|string',
            'genre'       => 'nullable|string',
            'tmdb_rating' => 'nullable|numeric',
        ]);

        $this->feedbackRepo->updateOrCreateFeedback(auth()->id(), $request->movie_id, $request->all());

        return response()->json(['message' => 'Feedback saved', 'status' => $request->type]);
    }

    public function getMatchScore(Request $request)
    {
        $request->validate([
            'genre' => 'required|string',
            'tmdb_rating' => 'required|numeric',
        ]);

        $genre = $request->genre;
        $currentRating = (float) $request->tmdb_rating;

        $likedInGenre = $this->feedbackRepo->getLikedInGenre(auth()->id(), $genre);

        if ($likedInGenre->isEmpty()) {
            return response()->json([
                 'match'   => null,
                 'count'   => 0,
                 'genre'   => $genre,
                 'message' => "Your first {$genre} movie! Like more to get a personalised score.",
            ]);
        }

        $avgRating = $likedInGenre->avg('tmdb_rating');
        $matchScore = min(100, (int) round(($currentRating / max($avgRating, 0.1)) * 100));
        $count = $likedInGenre->count();

        return response()->json([
            'match'   => $matchScore,
            'count'   => $count,
            'genre'   => $genre,
            'avg'     => round($avgRating, 1),
            'message' => "Based on {$count} liked {$genre} movies (avg " . number_format($avgRating, 1) . " rating).",
        ]);
    }

    public function indexDisliked(Request $request)
    {
        $disliked = $this->feedbackRepo->getFeedbackByTypeAndUser(auth()->id(), 'dislike');
        
        $disliked->each(function ($item) {
            if (empty($item->title) || empty($item->poster_path)) {
                try {
                    $details = $this->tmdb->getMovieDetails($item->movie_id);
                    if ($details) {
                        $this->feedbackRepo->update($item->id, [
                            'title' => $details['title'] ?? 'Unknown Movie',
                            'poster_path' => $details['poster_path'] ?? null
                        ]);
                        $item->title = $details['title'] ?? 'Unknown Movie';
                        $item->poster_path = $details['poster_path'] ?? null;
                    }
                } catch (\Exception $e) {
                    Log::error("Failed to repair dislike metadata for {$item->movie_id}: " . $e->getMessage());
                }
            }
        });

        return response()->json($disliked);
    }

    public function removeFeedback(Request $request)
    {
        $request->validate(['movie_id' => 'required']);
        $this->feedbackRepo->removeFeedback(auth()->id(), $request->movie_id);
        return response()->json(['message' => 'Feedback removed']);
    }

    public function indexWatchlist(Request $request)
    {
        $watchlists = $this->watchlistRepo->getLatestByUserId(auth()->id());
        return response()->json($watchlists);
    }

    public function indexLiked(Request $request)
    {
        $liked = $this->feedbackRepo->getFeedbackByTypeAndUser(auth()->id(), 'like');
        
        $liked->each(function ($item) {
            if (empty($item->title) || empty($item->poster_path)) {
                try {
                    $details = $this->tmdb->getMovieDetails($item->movie_id);
                    if ($details) {
                        $this->feedbackRepo->update($item->id, [
                            'title' => $details['title'] ?? 'Unknown Movie',
                            'poster_path' => $details['poster_path'] ?? null
                        ]);
                        $item->title = $details['title'] ?? 'Unknown Movie';
                        $item->poster_path = $details['poster_path'] ?? null;
                    }
                } catch (\Exception $e) {
                    Log::error("Failed to repair like metadata for {$item->movie_id}: " . $e->getMessage());
                }
            }
        });

        return response()->json($liked);
    }

    public function getMovieStatus($id)
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json([
                'in_watchlist' => false,
                'is_liked' => false,
                'is_disliked' => false
            ]);
        }

        $inWatchlist = $this->watchlistRepo->hasWatchlist($userId, $id);
        $feedback = $this->feedbackRepo->getFeedbackByUserAndMovie($userId, $id);

        return response()->json([
            'in_watchlist' => $inWatchlist,
            'is_liked' => $feedback ? $feedback->type === 'like' : false,
            'is_disliked' => $feedback ? $feedback->type === 'dislike' : false
        ]);
    }
}
