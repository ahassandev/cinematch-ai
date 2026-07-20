<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface MovieFeedbackRepositoryInterface extends BaseRepositoryInterface
{
    public function updateOrCreateFeedback(int $userId, int $movieId, array $data);
    
    public function getFeedbackByTypeAndUser(int $userId, string $type): Collection;
    
    public function getLikedInGenre(int $userId, string $genre): Collection;
    
    public function removeFeedback(int $userId, int $movieId): bool;
    
    public function getFeedbackMapForMovies(int $userId, array $movieIds): Collection;
    
    public function getFeedbackByUserAndMovie(int $userId, int $movieId);
}
