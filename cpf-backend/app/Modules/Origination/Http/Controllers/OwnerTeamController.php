<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Origination\Services\OwnerTeamService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerTeamController extends Controller
{
    public function __construct(
        private readonly OwnerTeamService $teamService,
    ) {}

    public function show(Request $request): JsonResponse
    {
        return ApiResponse::success($this->teamService->getTeam($request->user()));
    }
}
