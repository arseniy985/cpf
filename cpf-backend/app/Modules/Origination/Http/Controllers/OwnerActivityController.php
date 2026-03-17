<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Origination\Data\OwnerActivityEntryData;
use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Origination\Services\OwnerActivityService;
use App\Modules\Origination\Services\OwnerAccountProvisioner;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerActivityController extends Controller
{
    public function __construct(
        private readonly OwnerAccountProvisioner $provisioner,
        private readonly OwnerActivityService $activityService,
    ) {}

    public function organization(Request $request): JsonResponse
    {
        $account = $this->provisioner
            ->ensureForUser($request->user())
            ->loadMissing(['organization', 'bankProfile', 'onboarding']);

        return ApiResponse::success(
            $this->activityService
                ->forSubjects([$account, $account->organization, $account->bankProfile, $account->onboarding])
                ->map(fn ($entry) => OwnerActivityEntryData::fromModel($entry))
        );
    }

    public function project(Project $project): JsonResponse
    {
        $this->assertOwnerProject($project);

        return ApiResponse::success(
            $this->activityService
                ->forSubjects([$project])
                ->map(fn ($entry) => OwnerActivityEntryData::fromModel($entry))
        );
    }

    public function round(OfferingRound $round): JsonResponse
    {
        $this->assertOwnerRound($round);

        return ApiResponse::success(
            $this->activityService
                ->forSubjects([$round])
                ->map(fn ($entry) => OwnerActivityEntryData::fromModel($entry))
        );
    }

    private function assertOwnerProject(Project $project): void
    {
        abort_unless($project->owner_id === request()->user()->id, 404);
    }

    private function assertOwnerRound(OfferingRound $round): void
    {
        abort_unless($round->ownerAccount->members()->where('user_id', request()->user()->id)->exists(), 404);
    }
}
