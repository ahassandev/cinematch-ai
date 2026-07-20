<?php

namespace App\Repositories\Eloquent;

use App\Models\SearchHistory;
use App\Repositories\Interfaces\SearchHistoryRepositoryInterface;
use Illuminate\Support\Collection;

class SearchHistoryRepository extends BaseRepository implements SearchHistoryRepositoryInterface
{
    public function __construct(SearchHistory $model)
    {
        parent::__construct($model);
    }

    public function getRecentSearches(int $userId, int $limit = 5): Collection
    {
        return $this->model->where('user_id', $userId)
            ->latest()
            ->take($limit)
            ->pluck('query');
    }

    public function recordSearch(int $userId, string $query)
    {
        return $this->create([
            'user_id' => $userId,
            'query' => $query
        ]);
    }
}
