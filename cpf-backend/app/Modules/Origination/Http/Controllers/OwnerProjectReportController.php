<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Origination\Data\ProjectReportData;
use App\Modules\Origination\Domain\Models\ProjectReport;
use App\Modules\Origination\Http\Requests\StoreProjectReportRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OwnerProjectReportController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        $this->assertOwner($project);

        return ApiResponse::success(ProjectReportData::collect($project->reports()->get()));
    }

    public function store(StoreProjectReportRequest $request, Project $project): JsonResponse
    {
        $this->assertOwner($project);

        $report = ProjectReport::query()->create([
            ...$request->validated(),
            'project_id' => $project->id,
            'is_public' => $request->boolean('is_public', false),
        ]);

        return ApiResponse::success(ProjectReportData::fromModel($report), Response::HTTP_CREATED);
    }

    private function assertOwner(Project $project): void
    {
        abort_unless($project->owner_id === request()->user()->id, 404);
    }
}
