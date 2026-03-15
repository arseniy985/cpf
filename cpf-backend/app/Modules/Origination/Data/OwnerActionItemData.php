<?php

namespace App\Modules\Origination\Data;

use Spatie\LaravelData\Data;

class OwnerActionItemData extends Data
{
    public function __construct(
        public string $key,
        public string $title,
        public string $description,
        public string $href,
        public string $tone,
    ) {}
}
