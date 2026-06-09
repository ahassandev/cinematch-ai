<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Watchlist;
use App\Models\Favorite;
use App\Models\SearchHistory;
use App\Models\MovieFeedback;

class UserActivityController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = auth()->user();

        $stats = [
            'searches' => SearchHistory::where('user_id', $user->id)->count(),
            'watchlists' => Watchlist::where('user_id', $user->id)->count(),
            'favorites' => Favorite::where('user_id', $user->id)->count(),
            'recent_searches' => SearchHistory::where('user_id', $user->id)->latest()->take(5)->pluck('query'),
            'recent_watchlists' => Watchlist::where('user_id', $user->id)->latest()->take(5)->get(),
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

        $watchlist = Watchlist::where('user_id', auth()->id())
                              ->where('movie_id', $request->movie_id)
                              ->first();

        if ($watchlist) {
            $watchlist->delete();
            return response()->json(['message' => 'Removed from watchlist', 'status' => 'removed']);
        } else {
            Watchlist::create([
                'user_id' => auth()->id(),
                'movie_id' => $request->movie_id,
                'title' => $request->title,
                'poster_path' => $request->poster_path,
                'genre' => $request->genre,
                'rating' => $request->rating,
                'year' => $request->year,
            ]);
            return response()->json(['message' => 'Added to watchlist', 'status' => 'added']);
        }
    }

    public function toggleFavorite(Request $request)
    {
        $request->validate([
            'movie_id' => 'required',
            'title' => 'required',
            'poster_path' => 'nullable',
        ]);

        $favorite = Favorite::where('user_id', auth()->id())
                              ->where('movie_id', $request->movie_id)
                              ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['message' => 'Removed from favorites', 'status' => 'removed']);
        } else {
            Favorite::create([
                'user_id' => auth()->id(),
                'movie_id' => $request->movie_id,
                'title' => $request->title,
                'poster_path' => $request->poster_path,
            ]);
            return response()->json(['message' => 'Added to favorites', 'status' => 'added']);
        }
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

        $feedback = MovieFeedback::updateOrCreate(
            ['user_id' => auth()->id(), 'movie_id' => $request->movie_id],
            [
                'type' => $request->type,
                'title' => $request->title,
                'poster_path' => $request->poster_path,
                'genre' => $request->genre,
                'tmdb_rating' => $request->tmdb_rating,
            ]
        );

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

        // Get all liked movies of the same genre for this user
        $likedInGenre = MovieFeedback::where('user_id', auth()->id())
            ->where('type', 'like')
            ->where('genre', $genre)
            ->whereNotNull('tmdb_rating')
            ->get();

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
        $disliked = MovieFeedback::where('user_id', auth()->id())
                                 ->where('type', 'dislike')
                                 ->latest()
                                 ->get();
        
        // Auto-fix missing metadata for old records
        $tmdb = app(\App\Services\TMDBService::class);
        $disliked->each(function ($item) use ($tmdb) {
            if (empty($item->title) || empty($item->poster_path)) {
                try {
                    $details = $tmdb->getMovieDetails($item->movie_id);
                    if ($details) {
                        $item->update([
                            'title' => $details['title'] ?? 'Unknown Movie',
                            'poster_path' => $details['poster_path'] ?? null
                        ]);
                    }
                } catch (\Exception $e) {
                    \Log::error("Failed to repair dislike metadata for {$item->movie_id}: " . $e->getMessage());
                }
            }
        });

        return response()->json($disliked);
    }

    public function removeFeedback(Request $request)
    {
        $request->validate(['movie_id' => 'required']);
        
        MovieFeedback::where('user_id', auth()->id())
                    ->where('movie_id', $request->movie_id)
                    ->delete();
                    
        return response()->json(['message' => 'Feedback removed']);
    }

    public function indexWatchlist(Request $request)
    {
        $watchlists = Watchlist::where('user_id', auth()->id())->latest()->get();
        return response()->json($watchlists);
    }

    public function indexLiked(Request $request)
    {
        $liked = MovieFeedback::where('user_id', auth()->id())
                                 ->where('type', 'like')
                                 ->latest()
                                 ->get();
        
        // Auto-fix missing metadata for old records
        $tmdb = app(\App\Services\TMDBService::class);
        $liked->each(function ($item) use ($tmdb) {
            if (empty($item->title) || empty($item->poster_path)) {
                try {
                    $details = $tmdb->getMovieDetails($item->movie_id);
                    if ($details) {
                        $item->update([
                            'title' => $details['title'] ?? 'Unknown Movie',
                            'poster_path' => $details['poster_path'] ?? null
                        ]);
                    }
                } catch (\Exception $e) {
                    \Log::error("Failed to repair like metadata for {$item->movie_id}: " . $e->getMessage());
                }
            }
        });

        return response()->json($liked);
    }
}
