<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Identity\Data\AuthUserData;
use App\Modules\Origination\Services\OwnerEnrollmentService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerEnrollmentController extends Controller
{
    public function __construct(
        private readonly OwnerEnrollmentService $ownerEnrollmentService,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $user = $this->ownerEnrollmentService->enroll($request->user());

        return ApiResponse::success(AuthUserData::fromModel($user));
    }
}
