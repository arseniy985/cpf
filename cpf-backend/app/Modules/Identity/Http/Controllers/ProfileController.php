<?php

namespace App\Modules\Identity\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Identity\Data\AuthUserData;
use App\Modules\Identity\Http\Requests\UpdateProfileRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->fill($request->safe()->only(['name', 'phone', 'notification_preferences']));
        $user->save();
        $user->load('kycProfile');

        return ApiResponse::success(AuthUserData::fromModel($user));
    }
}
