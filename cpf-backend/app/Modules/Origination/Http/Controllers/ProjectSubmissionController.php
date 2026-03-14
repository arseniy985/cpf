<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Origination\Domain\Models\ProjectSubmission;
use App\Modules\Origination\Http\Requests\StoreProjectSubmissionRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class ProjectSubmissionController extends Controller
{
    public function store(StoreProjectSubmissionRequest $request): JsonResponse
    {
        $submission = ProjectSubmission::query()->create([
            ...$request->validated(),
            'status' => 'new',
        ]);

        return ApiResponse::success([
            'id' => $submission->id,
            'status' => $submission->status,
        ], 201);
    }
}
