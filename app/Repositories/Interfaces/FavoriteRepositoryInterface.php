<?php

namespace App\Repositories\Interfaces;

interface FavoriteRepositoryInterface extends BaseRepositoryInterface
{
    public function findByUserAndMovie(int $userId, int $movieId);
    
    public function toggle(int $userId, array $movieData): array;
}
