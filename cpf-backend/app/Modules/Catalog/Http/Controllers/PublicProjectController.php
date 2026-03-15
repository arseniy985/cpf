<?php

namespace App\Modules\Catalog\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Actions\ListProjectsAction;
use App\Modules\Catalog\Actions\ShowProjectAction;
use App\Modules\Catalog\Data\ProjectData;
use App\Modules\Catalog\Data\ProjectDocumentData;
use App\Modules\Catalog\Data\ProjectFaqItemData;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Catalog\Http\Requests\CalculatorEstimateRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class PublicProjectController extends Controller
{
    public function __construct(
        private readonly ListProjectsAction $listProjects,
        private readonly ShowProjectAction $showProject,
    ) {}

    public function index(): JsonResponse
    {
        $projects = $this->listProjects->execute();

        return ApiResponse::paginated($projects, ProjectData::collect($projects->getCollection()->all()));
    }

    public function show(string $projectSlug): JsonResponse
    {
        return ApiResponse::success(ProjectData::fromModel(
            $this->showProject->execute($this->resolvePublishedProject($projectSlug)),
        ));
    }

    public function documents(string $projectSlug): JsonResponse
    {
        $project = $this->resolvePublishedProject($projectSlug);
        $project->load('documents');

        return ApiResponse::success(ProjectDocumentData::collect($project->documents->where('is_public', true)->values()));
    }

    public function faq(string $projectSlug): JsonResponse
    {
        $project = $this->resolvePublishedProject($projectSlug);
        $items = $project->faqItems()->published()->get();

        return ApiResponse::success(ProjectFaqItemData::collect($items));
    }

    public function payoutForecast(string $projectSlug): JsonResponse
    {
        $project = $this->resolvePublishedProject($projectSlug);

        return ApiResponse::success(
            $this->buildForecast(
                $project,
                (int) request()->integer('amount', $project->min_investment),
                (int) request()->integer('term_months', $project->term_months),
            ),
        );
    }

    public function calculate(CalculatorEstimateRequest $request): JsonResponse
    {
        $project = Project::query()->published()->findOrFail($request->string('project_id')->toString());

        return ApiResponse::success(
            $this->buildForecast(
                $project,
                $request->integer('amount'),
                (int) $request->integer('term_months', $project->term_months),
            ),
        );
    }

    private function buildForecast(Project $project, int $amount, int $termMonths): array
    {
        $normalizedAmount = max($amount, $project->min_investment);
        $normalizedTerm = max($termMonths, 1);
        $monthlyRate = ((float) $project->target_yield / 100) / 12;
        $monthlyIncome = (int) round($normalizedAmount * $monthlyRate);
        $schedule = [];

        for ($month = 1; $month <= $normalizedTerm; $month++) {
            $schedule[] = [
                'month' => $month,
                'payout' => $month === $normalizedTerm ? $monthlyIncome + $normalizedAmount : $monthlyIncome,
            ];
        }

        return [
            'projectId' => $project->id,
            'amount' => $normalizedAmount,
            'termMonths' => $normalizedTerm,
            'monthlyIncome' => $monthlyIncome,
            'totalPayout' => array_sum(array_column($schedule, 'payout')),
            'schedule' => $schedule,
        ];
    }

    private function resolvePublishedProject(string $projectSlug): Project
    {
        return Project::query()
            ->published()
            ->where('slug', $projectSlug)
            ->firstOrFail();
    }
}
