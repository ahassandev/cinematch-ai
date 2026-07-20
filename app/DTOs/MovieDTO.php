<?php

namespace App\DTOs;

class MovieDTO extends BaseDTO implements \JsonSerializable
{
    public function __construct(
        public readonly int $id,
        public readonly ?string $title = null,
        public readonly ?string $posterPath = null,
        public readonly ?string $releaseDate = null,
        public readonly ?float $voteAverage = null,
        public readonly ?string $overview = null,
        public readonly ?array $genres = null,
        public readonly ?string $mediaType = 'movie',
        public bool $inWatchlist = false,
        public bool $isLiked = false,
        public bool $isDisliked = false,
        public ?int $score = null,
        public ?string $aiReason = null,
        public ?string $aiDirector = null,
        public ?string $aiGenreName = null,
        public ?string $aiDescription = null
    ) {
    }

    public static function fromTMDBArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? 0,
            title: $data['title'] ?? $data['name'] ?? null,
            posterPath: $data['poster_path'] ?? null,
            releaseDate: $data['release_date'] ?? $data['first_air_date'] ?? null,
            voteAverage: isset($data['vote_average']) ? (float)$data['vote_average'] : null,
            overview: $data['overview'] ?? null,
            genres: $data['genres'] ?? $data['genre_ids'] ?? [],
            mediaType: $data['media_type'] ?? 'movie',
            
            // These properties can be populated by the frontend or discovery services
            score: $data['score'] ?? null,
            aiReason: $data['ai_reason'] ?? null,
            aiDirector: $data['ai_director'] ?? null,
            aiGenreName: $data['ai_genre_name'] ?? null,
            aiDescription: $data['ai_description'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'poster_path' => $this->posterPath,
            'release_date' => $this->releaseDate,
            'vote_average' => $this->voteAverage,
            'overview' => $this->overview,
            'media_type' => $this->mediaType,
            'in_watchlist' => $this->inWatchlist,
            'is_liked' => $this->isLiked,
            'is_disliked' => $this->isDisliked,
            
            // AI Reccomendation specific properties (only included if not null)
            'score' => $this->score,
            'ai_reason' => $this->aiReason,
            'ai_director' => $this->aiDirector,
            'ai_genre_name' => $this->aiGenreName,
            'ai_description' => $this->aiDescription,
            
            'genres' => $this->genres,
        ];
    }
    
    public function jsonSerialize(): mixed
    {
        return array_filter($this->toArray(), fn($val) => $val !== null);
    }
}
