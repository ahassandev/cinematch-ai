<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('/movie/{id}', function ($id) {
    return Inertia::render('MovieDetails', ['id' => $id]);
})->name('movie');

Route::get('/movies', function () {
    return Inertia::render('Movies');
})->name('movies');

Route::get('/trending', function () {
    return Inertia::render('Trending');
})->name('trending');

Route::get('/recommendations', function () {
    return Inertia::render('Recommendations');
})->name('recommendations');

// Record search history for logged-in users (runs in web middleware = session aware)
Route::get('/user/record-search', function (\Illuminate\Http\Request $request) {
    if (auth()->check() && $request->filled('query')) {
        \App\Models\SearchHistory::create([
            'user_id' => auth()->id(),
            'query'   => $request->input('query'),
        ]);
    }
    return response()->json(['ok' => true]);
});

Route::delete('/user/search-history/{id}', function ($id) {
    if (auth()->check()) {
        \App\Models\SearchHistory::where('user_id', auth()->id())
            ->where('id', $id)
            ->delete();
    }
    return response()->json(['ok' => true]);
})->middleware('auth');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/watchlist', function () {
        return Inertia::render('Watchlist');
    })->name('watchlist');

    // User activity — needs session auth (web middleware handles CSRF)
    Route::post('/user/watchlist/toggle', [\App\Http\Controllers\Api\UserActivityController::class, 'toggleWatchlist']);
    Route::post('/user/favorites/toggle', [\App\Http\Controllers\Api\UserActivityController::class, 'toggleFavorite']);
    Route::post('/user/feedback', [\App\Http\Controllers\Api\UserActivityController::class, 'leaveFeedback']);
});
