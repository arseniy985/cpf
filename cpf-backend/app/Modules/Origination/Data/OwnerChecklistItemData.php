<?php

namespace App\Modules\Origination\Data;

use Spatie\LaravelData\Data;

class OwnerChecklistItemData extends Data
{
    public function __construct(
        public string $key,
        public string $title,
        public string $description,
        public bool $completed,
        public string $href,
    ) {}
}
