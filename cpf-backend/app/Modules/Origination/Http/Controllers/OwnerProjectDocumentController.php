<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Data\ProjectDocumentData;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Catalog\Domain\Models\ProjectDocument;
use App\Modules\Origination\Http\Requests\StoreOwnerProjectDocumentRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OwnerProjectDocumentController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        $this->assertOwner($project);
        $project->load('documents');

        return ApiResponse::success(ProjectDocumentData::collect($project->documents));
    }

    public function store(StoreOwnerProjectDocumentRequest $request, Project $project): JsonResponse
    {
        $this->assertOwner($project);

        $document = ProjectDocument::query()->create([
            ...$request->validated(),
            'project_id' => $project->id,
            'sort_order' => $request->integer('sort_order', 0),
            'is_public' => $request->boolean('is_public', false),
        ]);

        return ApiResponse::success(ProjectDocumentData::fromModel($document), Response::HTTP_CREATED);
    }

    private function assertOwner(Project $project): void
    {
        abort_unless($project->owner_id === request()->user()->id, 404);
    }
}
