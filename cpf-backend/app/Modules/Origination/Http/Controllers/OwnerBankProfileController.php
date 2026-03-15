<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Origination\Data\OwnerBankProfileData;
use App\Modules\Origination\Http\Requests\UpdateOwnerBankProfileRequest;
use App\Modules\Origination\Services\OwnerAccountProvisioner;
use App\Modules\Origination\Services\OwnerWorkspaceService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class OwnerBankProfileController extends Controller
{
    public function __construct(
        private readonly OwnerAccountProvisioner $provisioner,
        private readonly OwnerWorkspaceService $workspaceService,
    ) {}

    public function update(UpdateOwnerBankProfileRequest $request): JsonResponse
    {
        $account = $this->provisioner->ensureForUser($request->user());
        $bankProfile = $account->bankProfile;
        $bankProfile->fill([
            ...$request->validated(),
            'status' => 'ready_for_review',
        ]);
        $bankProfile->save();

        $this->workspaceService->touchProgress($account);

        return ApiResponse::success(OwnerBankProfileData::fromModel($bankProfile->fresh()));
    }
}
