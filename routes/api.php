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
Route::get('/movies/recommendations/{id}', [MovieController::class, 'recommendations']);
Route::get('/movies/discover', [MovieController::class, 'discover']);
Route::get('/movies/genres', [MovieController::class, 'genres']);

Route::middleware('auth:web')->group(function () {
    Route::get('/user/dashboard-stats', [UserActivityController::class, 'dashboard']);
    Route::get('/user/watchlist', [UserActivityController::class, 'indexWatchlist']);
    // Toggle routes moved to web.php for proper session/CSRF handling
});
