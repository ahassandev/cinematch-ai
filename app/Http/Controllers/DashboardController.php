<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\SearchHistory;
use App\Models\Watchlist;
use App\Models\Favorite;
use App\Models\MovieFeedback;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $stats = [
            'searches'         => SearchHistory::where('user_id', $user->id)->count(),
            'watchlists'       => Watchlist::where('user_id', $user->id)->count(),
            'favorites'        => Favorite::where('user_id', $user->id)->count(),
            'recent_searches'  => SearchHistory::where('user_id', $user->id)
                                    ->latest()->take(8)->get(['id', 'query']),
            'recent_watchlists'=> Watchlist::where('user_id', $user->id)
                                    ->latest()->take(5)->get(),
        ];

        return Inertia::render('Dashboard', ['stats' => $stats]);
    }
}
