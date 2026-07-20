<?php

namespace App\DTOs;

abstract class BaseDTO
{
    /**
     * Create a new DTO instance from an array of properties.
     */
    public static function fromArray(array $data): static
    {
        return new static(...$data);
    }

    /**
     * Convert the DTO to an associative array.
     */
    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
