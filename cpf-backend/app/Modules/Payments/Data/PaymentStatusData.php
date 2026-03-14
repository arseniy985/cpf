<?php

namespace App\Modules\Payments\Data;

use Spatie\LaravelData\Data;

class PaymentStatusData extends Data
{
    public function __construct(
        public string $externalId,
        public string $status,
        public ?string $confirmationUrl,
        public ?string $statusReason,
        public array $payload,
    ) {}
}
