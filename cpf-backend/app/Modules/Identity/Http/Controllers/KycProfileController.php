<?php

namespace App\Modules\Identity\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Identity\Data\KycProfileData;
use App\Modules\Identity\Domain\Models\KycProfile;
use App\Modules\Identity\Http\Requests\UpsertKycProfileRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class KycProfileController extends Controller
{
    public function show(): JsonResponse
    {
        $profile = request()->user()->load('kycProfile')->kycProfile;

        return ApiResponse::success($profile ? KycProfileData::fromModel($profile) : null);
    }

    public function store(UpsertKycProfileRequest $request): JsonResponse
    {
        $profile = KycProfile::query()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                ...$request->validated(),
                'status' => 'pending_review',
                'submitted_at' => now(),
            ],
        );

        return ApiResponse::success(KycProfileData::fromModel($profile), 201);
    }
}
