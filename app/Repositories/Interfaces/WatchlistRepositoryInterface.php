<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface WatchlistRepositoryInterface extends BaseRepositoryInterface
{
    public function getLatestByUserId(int $userId, int $limit = 0): Collection;
    
    public function hasWatchlist(int $userId, int $movieId): bool;
    
    public function findByUserAndMovie(int $userId, int $movieId);
    
    public function toggle(int $userId, array $movieData): array;
    
    public function getMovieIdsByUser(int $userId, array $movieIds): array;
}
