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
            'movie_id' => 'required',
            'type' => 'required|in:like,dislike'
        ]);

        $feedback = MovieFeedback::updateOrCreate(
            ['user_id' => auth()->id(), 'movie_id' => $request->movie_id],
            ['type' => $request->type]
        );

        return response()->json(['message' => 'Feedback saved', 'status' => $request->type]);
    }

    public function indexWatchlist(Request $request)
    {
        $watchlists = Watchlist::where('user_id', auth()->id())->latest()->get();
        return response()->json($watchlists);
    }
}
