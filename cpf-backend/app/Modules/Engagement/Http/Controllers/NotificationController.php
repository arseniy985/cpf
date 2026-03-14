<?php

namespace App\Modules\Engagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Engagement\Data\NotificationData;
use App\Modules\Engagement\Domain\Models\Notification;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $notifications = request()->user()->notifications()->get();

        return ApiResponse::success(NotificationData::collect($notifications));
    }

    public function markAsRead(Notification $notification): JsonResponse
    {
        abort_unless($notification->user_id === request()->user()->id, 404);

        $notification->forceFill(['read_at' => now()])->save();

        return ApiResponse::success(NotificationData::fromModel($notification));
    }
}
