<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Origination\Data\OwnerAccountData;
use App\Modules\Origination\Http\Requests\UpdateOwnerAccountRequest;
use App\Modules\Origination\Services\OwnerAccountProvisioner;
use App\Modules\Origination\Services\OwnerWorkspaceService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class OwnerAccountController extends Controller
{
    public function __construct(
        private readonly OwnerAccountProvisioner $provisioner,
        private readonly OwnerWorkspaceService $workspaceService,
    ) {}

    public function update(UpdateOwnerAccountRequest $request): JsonResponse
    {
        $account = $this->provisioner->ensureForUser($request->user());
        $account->fill($request->validated());
        $account->save();

        $this->workspaceService->touchProgress($account);

        return ApiResponse::success(OwnerAccountData::fromModel($account->fresh()));
    }
}
