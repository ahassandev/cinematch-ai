<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\UserActivityController;

Route::get('/movies/search', [MovieController::class, 'search']);
Route::get('/movies/popular', [MovieController::class, 'popular']);
Route::get('/movies/details/{id}', [MovieController::class, 'details']);
Route::get('/tv/details/{id}', [MovieController::class, 'tvDetails']);
Route::get('/movies/trending', [MovieController::class, 'getTrending']);
Route::get('/movies/recommendations/{id}', [MovieController::class, 'recommendations']);
Route::get('/movies/ai-recommendations/{id}', [MovieController::class, 'getMovieAIRecommendations']);
Route::get('/movies/personalized', [MovieController::class, 'getPersonalizedRecommendations']);
Route::get('/movies/discover', [MovieController::class, 'discover']);
Route::get('/movies/genres', [MovieController::class, 'genres']);

Route::middleware('auth:web')->group(function () {
    Route::get('/user/dashboard-stats', [UserActivityController::class, 'dashboard']);
    Route::post('/user/watchlist/toggle', [UserActivityController::class, 'toggleWatchlist']);
    Route::post('/user/favorites/toggle', [UserActivityController::class, 'toggleFavorite']);
    Route::post('/user/feedback', [UserActivityController::class, 'leaveFeedback']);
    Route::post('/user/feedback/remove', [UserActivityController::class, 'removeFeedback']);
    Route::get('/user/watchlist', [UserActivityController::class, 'indexWatchlist']);
    Route::get('/user/disliked', [UserActivityController::class, 'indexDisliked']);
    Route::get('/user/match-score', [UserActivityController::class, 'getMatchScore']);
    // Toggle routes moved to web.php for proper session/CSRF handling
});
