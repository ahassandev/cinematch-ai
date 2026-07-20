<?php

namespace App\Repositories\Eloquent;

use App\Models\Favorite;
use App\Repositories\Interfaces\FavoriteRepositoryInterface;

class FavoriteRepository extends BaseRepository implements FavoriteRepositoryInterface
{
    public function __construct(Favorite $model)
    {
        parent::__construct($model);
    }

    public function findByUserAndMovie(int $userId, int $movieId)
    {
        return $this->model->where('user_id', $userId)->where('movie_id', $movieId)->first();
    }

    public function toggle(int $userId, array $movieData): array
    {
        $favorite = $this->findByUserAndMovie($userId, $movieData['movie_id']);

        if ($favorite) {
            $favorite->delete();
            return ['status' => 'removed', 'message' => 'Removed from favorites'];
        }

        $movieData['user_id'] = $userId;
        $this->create($movieData);
        
        return ['status' => 'added', 'message' => 'Added to favorites'];
    }
}
