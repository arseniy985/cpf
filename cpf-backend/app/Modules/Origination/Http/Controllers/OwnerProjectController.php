<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Data\ProjectData;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Origination\Http\Requests\StoreOwnerProjectRequest;
use App\Modules\Origination\Http\Requests\UpdateOwnerProjectRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Symfony\Component\HttpFoundation\Response;

class OwnerProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = request()->user()
            ->ownedProjects()
            ->with(['documents', 'reports'])
            ->latest()
            ->get();

        return ApiResponse::success(ProjectData::collect($projects));
    }

    public function store(StoreOwnerProjectRequest $request): JsonResponse
    {
        $project = Project::query()->create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
            'status' => 'draft',
            'funding_status' => 'preparing',
            'current_amount' => 0,
            'is_featured' => false,
        ]);

        $project->load('documents');

        return ApiResponse::success(ProjectData::fromModel($project), Response::HTTP_CREATED);
    }

    public function show(Project $project): JsonResponse
    {
        $this->assertOwner($project);
        $project->load(['documents', 'reports', 'investmentApplications']);

        return ApiResponse::success([
            'project' => ProjectData::fromModel($project),
            'metrics' => [
                'applicationsCount' => $project->investmentApplications->count(),
                'confirmedAmount' => (int) $project->investmentApplications->where('status', 'confirmed')->sum('amount'),
            ],
        ]);
    }

    public function update(UpdateOwnerProjectRequest $request, Project $project): JsonResponse
    {
        $this->assertOwner($project);

        $project->fill(Arr::except($request->validated(), ['status', 'funding_status', 'owner_id']));
        $project->save();
        $project->load('documents');

        return ApiResponse::success(ProjectData::fromModel($project));
    }

    public function submitReview(Project $project): JsonResponse
    {
        $this->assertOwner($project);

        $project->forceFill([
            'status' => 'pending_review',
            'review_submitted_at' => now(),
        ])->save();

        return ApiResponse::success(ProjectData::fromModel($project->load('documents')));
    }

    public function investments(Project $project): JsonResponse
    {
        $this->assertOwner($project);

        return ApiResponse::success([
            'applicationsCount' => $project->investmentApplications()->count(),
            'pendingAmount' => (int) $project->investmentApplications()->where('status', 'pending')->sum('amount'),
            'confirmedAmount' => (int) $project->investmentApplications()->where('status', 'confirmed')->sum('amount'),
        ]);
    }

    private function assertOwner(Project $project): void
    {
        abort_unless($project->owner_id === request()->user()->id, 404);
    }
}
