<?php

namespace App\Repositories\Eloquent;

use App\Models\MovieFeedback;
use App\Repositories\Interfaces\MovieFeedbackRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class MovieFeedbackRepository extends BaseRepository implements MovieFeedbackRepositoryInterface
{
    public function __construct(MovieFeedback $model)
    {
        parent::__construct($model);
    }

    public function updateOrCreateFeedback(int $userId, int $movieId, array $data)
    {
        return $this->model->updateOrCreate(
            ['user_id' => $userId, 'movie_id' => $movieId],
            $data
        );
    }

    public function getFeedbackByTypeAndUser(int $userId, string $type): Collection
    {
        return $this->model->where('user_id', $userId)
            ->where('type', $type)
            ->latest()
            ->get();
    }

    public function getLikedInGenre(int $userId, string $genre): Collection
    {
        return $this->model->where('user_id', $userId)
            ->where('type', 'like')
            ->where('genre', $genre)
            ->whereNotNull('tmdb_rating')
            ->get();
    }

    public function removeFeedback(int $userId, int $movieId): bool
    {
        return (bool) $this->model->where('user_id', $userId)
            ->where('movie_id', $movieId)
            ->delete();
    }

    public function getFeedbackMapForMovies(int $userId, array $movieIds): Collection
    {
        return $this->model->where('user_id', $userId)
            ->whereIn('movie_id', $movieIds)
            ->get()
            ->keyBy('movie_id');
    }

    public function getFeedbackByUserAndMovie(int $userId, int $movieId)
    {
        return $this->model->where('user_id', $userId)
            ->where('movie_id', $movieId)
            ->first();
    }
}
