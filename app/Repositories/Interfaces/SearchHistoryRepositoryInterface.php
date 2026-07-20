<?php

namespace App\Repositories\Interfaces;

use Illuminate\Support\Collection;

interface SearchHistoryRepositoryInterface extends BaseRepositoryInterface
{
    public function getRecentSearches(int $userId, int $limit = 5): Collection;
    
    public function recordSearch(int $userId, string $query);
}
