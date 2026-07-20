<?php

namespace App\Repositories\Eloquent;

use App\Models\Watchlist;
use App\Repositories\Interfaces\WatchlistRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class WatchlistRepository extends BaseRepository implements WatchlistRepositoryInterface
{
    public function __construct(Watchlist $model)
    {
        parent::__construct($model);
    }

    public function getLatestByUserId(int $userId, int $limit = 0): Collection
    {
        $query = $this->model->where('user_id', $userId)->latest();
        if ($limit > 0) {
            $query->take($limit);
        }
        return $query->get();
    }

    public function hasWatchlist(int $userId, int $movieId): bool
    {
        return $this->model->where('user_id', $userId)->where('movie_id', $movieId)->exists();
    }

    public function findByUserAndMovie(int $userId, int $movieId)
    {
        return $this->model->where('user_id', $userId)->where('movie_id', $movieId)->first();
    }

    public function toggle(int $userId, array $movieData): array
    {
        $watchlist = $this->findByUserAndMovie($userId, $movieData['movie_id']);

        if ($watchlist) {
            $watchlist->delete();
            return ['status' => 'removed', 'message' => 'Removed from watchlist'];
        }

        $movieData['user_id'] = $userId;
        $this->create($movieData);
        
        return ['status' => 'added', 'message' => 'Added to watchlist'];
    }

    public function getMovieIdsByUser(int $userId, array $movieIds): array
    {
        return $this->model->where('user_id', $userId)
            ->whereIn('movie_id', $movieIds)
            ->pluck('movie_id')
            ->toArray();
    }
}
