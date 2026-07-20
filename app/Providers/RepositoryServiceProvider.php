<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\WatchlistRepositoryInterface;
use App\Repositories\Eloquent\WatchlistRepository;
use App\Repositories\Interfaces\FavoriteRepositoryInterface;
use App\Repositories\Eloquent\FavoriteRepository;
use App\Repositories\Interfaces\MovieFeedbackRepositoryInterface;
use App\Repositories\Eloquent\MovieFeedbackRepository;
use App\Repositories\Interfaces\SearchHistoryRepositoryInterface;
use App\Repositories\Eloquent\SearchHistoryRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(WatchlistRepositoryInterface::class, WatchlistRepository::class);
        $this->app->bind(FavoriteRepositoryInterface::class, FavoriteRepository::class);
        $this->app->bind(MovieFeedbackRepositoryInterface::class, MovieFeedbackRepository::class);
        $this->app->bind(SearchHistoryRepositoryInterface::class, SearchHistoryRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
