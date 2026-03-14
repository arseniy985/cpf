<?php

namespace App\Modules\Engagement\Data;

use App\Modules\Engagement\Domain\Models\Notification;
use Spatie\LaravelData\Data;

class NotificationData extends Data
{
    public function __construct(
        public string $id,
        public string $type,
        public string $title,
        public string $body,
        public ?string $actionUrl,
        public bool $isRead,
        public string $createdAt,
    ) {}

    public static function fromModel(Notification $notification): self
    {
        return new self(
            id: $notification->id,
            type: $notification->type,
            title: $notification->title,
            body: $notification->body,
            actionUrl: $notification->action_url,
            isRead: $notification->read_at !== null,
            createdAt: $notification->created_at->toAtomString(),
        );
    }
}
