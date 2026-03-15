<?php

namespace App\Modules\Payments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payments\Data\InvestorPayoutProfileData;
use App\Modules\Payments\Domain\Models\InvestorPayoutProfile;
use App\Modules\Payments\Http\Requests\UpsertInvestorPayoutProfileRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class InvestorPayoutProfileController extends Controller
{
    public function show(): JsonResponse
    {
        return ApiResponse::success(
            InvestorPayoutProfileData::fromModel(
                request()->user()->investorPayoutProfile,
            ),
        );
    }

    public function upsert(UpsertInvestorPayoutProfileRequest $request): JsonResponse
    {
        $profile = InvestorPayoutProfile::query()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'provider' => $request->string('provider')->toString(),
                'payout_method_label' => $request->input('payout_method_label'),
                'payout_token' => $request->input('payout_token'),
                'status' => $request->filled('payout_token') ? 'ready' : 'draft',
                'last_verified_at' => $request->filled('payout_token') ? now() : null,
            ],
        );

        return ApiResponse::success(InvestorPayoutProfileData::fromModel($profile));
    }
}
