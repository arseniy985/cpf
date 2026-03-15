<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Origination\Services\OwnerWorkspaceService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerWorkspaceController extends Controller
{
    public function __construct(
        private readonly OwnerWorkspaceService $workspaceService,
    ) {}

    public function show(Request $request): JsonResponse
    {
        return ApiResponse::success($this->workspaceService->getWorkspace($request->user()));
    }
}
