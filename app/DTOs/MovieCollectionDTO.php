<?php

namespace App\DTOs;

class MovieCollectionDTO extends BaseDTO implements \JsonSerializable
{
    /** @var MovieDTO[] */
    public array $results;
    
    public function __construct(
        array $results = [],
        public readonly int $page = 1,
        public readonly int $totalPages = 1,
        public readonly int $totalResults = 0
    ) {
        $this->results = $results;
    }

    public static function fromTMDBArray(array $data): self
    {
        $results = [];
        if (isset($data['results']) && is_array($data['results'])) {
            foreach ($data['results'] as $item) {
                $results[] = MovieDTO::fromTMDBArray($item);
            }
        }

        return new self(
            results: $results,
            page: $data['page'] ?? 1,
            totalPages: $data['total_pages'] ?? 1,
            totalResults: $data['total_results'] ?? count($results)
        );
    }

    public function toArray(): array
    {
        return [
            'page' => $this->page,
            'results' => array_map(fn(MovieDTO $dto) => $dto->toArray(), $this->results),
            'total_pages' => $this->totalPages,
            'total_results' => $this->totalResults,
        ];
    }
    
    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }
}
