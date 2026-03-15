<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Origination\Data\OwnerOrganizationData;
use App\Modules\Origination\Http\Requests\UpdateOwnerOrganizationRequest;
use App\Modules\Origination\Services\OwnerAccountProvisioner;
use App\Modules\Origination\Services\OwnerWorkspaceService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class OwnerOrganizationController extends Controller
{
    public function __construct(
        private readonly OwnerAccountProvisioner $provisioner,
        private readonly OwnerWorkspaceService $workspaceService,
    ) {}

    public function update(UpdateOwnerOrganizationRequest $request): JsonResponse
    {
        $account = $this->provisioner->ensureForUser($request->user());
        $organization = $account->organization;
        $organization->fill($request->validated());
        $organization->save();

        $this->workspaceService->touchProgress($account);

        return ApiResponse::success(OwnerOrganizationData::fromModel($organization->fresh()));
    }
}
