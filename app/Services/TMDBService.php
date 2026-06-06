<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class TMDBService
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = env('TMDB_BASE_URL', 'https://api.themoviedb.org/3');
        $this->apiKey = env('TMDB_API_KEY');
    }

    public function searchMovies($query)
    {
        return Cache::remember("tmdb_search_{$query}", 3600, function () use ($query) {
            $response = Http::get("{$this->baseUrl}/search/multi", [
                'api_key' => $this->apiKey,
                'query' => $query,
                'include_adult' => false
            ]);

            return $response->json();
        });
    }

    public function getPopularMovies()
    {
        return Cache::remember("tmdb_popular", 3600, function () {
            $response = Http::get("{$this->baseUrl}/movie/popular", [
                'api_key' => $this->apiKey,
                'include_adult' => false
            ]);

            return $response->json();
        });
    }

    public function getMovieDetails($id)
    {
        return Cache::remember("tmdb_movie_{$id}", 3600, function () use ($id) {
            $response = Http::get("{$this->baseUrl}/movie/{$id}", [
                'api_key' => $this->apiKey,
                'append_to_response' => 'credits,videos,reviews'
            ]);

            return $response->json();
        });
    }

    public function getTVDetails($id)
    {
        return Cache::remember("tmdb_tv_{$id}", 3600, function () use ($id) {
            $response = Http::get("{$this->baseUrl}/tv/{$id}", [
                'api_key' => $this->apiKey,
                'append_to_response' => 'credits,videos,reviews'
            ]);

            return $response->json();
        });
    }

    public function getRecommendations($id)
    {
        return Cache::remember("tmdb_recs_{$id}", 3600, function () use ($id) {
            $response = Http::get("{$this->baseUrl}/movie/{$id}/recommendations", [
                'api_key' => $this->apiKey
            ]);

            return $response->json();
        });
    }

    public function getGenres()
    {
        return Cache::remember("tmdb_genres", 86400, function () {
            $response = Http::get("{$this->baseUrl}/genre/movie/list", [
                'api_key' => $this->apiKey
            ]);

            return $response->json();
        });
    }

    public function discoverMovies($params = [])
    {
        $cacheKey = "tmdb_discover_" . md5(json_encode($params));
        return Cache::remember($cacheKey, 3600, function () use ($params) {
            $queryParams = array_merge([
                'api_key' => $this->apiKey,
                'include_adult' => false,
                'sort_by' => 'popularity.desc'
            ], $params);

            $response = Http::get("{$this->baseUrl}/discover/movie", $queryParams);

            return $response->json();
        });
    }
}
