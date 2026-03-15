<?php

namespace App\Modules\Origination\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Investing\Data\InvestorAllocationData;
use App\Modules\Origination\Data\OfferingRoundData;
use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Origination\Http\Requests\StoreOfferingRoundRequest;
use App\Modules\Origination\Http\Requests\UpdateOfferingRoundRequest;
use App\Modules\Origination\Services\OfferingRoundService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OwnerRoundController extends Controller
{
    public function __construct(
        private readonly OfferingRoundService $roundService,
    ) {}

    public function index(): JsonResponse
    {
        $rounds = $this->roundService->listForOwner(request()->user());

        return ApiResponse::success(OfferingRoundData::collect($rounds));
    }

    public function store(StoreOfferingRoundRequest $request): JsonResponse
    {
        $round = $this->roundService->create($request->user(), $request->validated());
        $round->load(['project', 'allocations', 'distributions']);

        return ApiResponse::success(OfferingRoundData::fromModel($round), Response::HTTP_CREATED);
    }

    public function show(OfferingRound $round): JsonResponse
    {
        abort_unless($round->ownerAccount->members()->where('user_id', request()->user()->id)->exists(), 404);

        $round->load([
            'project.documents',
            'allocations.round',
            'allocations.project.documents',
            'allocations.user',
            'distributions.round',
        ]);

        return ApiResponse::success([
            'round' => OfferingRoundData::fromModel($round),
            'project' => \App\Modules\Catalog\Data\ProjectData::fromModel($round->project),
            'allocations' => InvestorAllocationData::collect($round->allocations),
            'distributions' => \App\Modules\Payments\Data\DistributionData::collect($round->distributions),
            'metrics' => [
                'allocationCount' => $round->allocations->count(),
                'confirmedAmount' => (int) $round->allocations->where('status', 'confirmed')->sum('amount'),
                'distributedAmount' => (int) $round->distributions->sum('total_amount'),
            ],
        ]);
    }

    public function update(UpdateOfferingRoundRequest $request, OfferingRound $round): JsonResponse
    {
        $round = $this->roundService->update($request->user(), $round, $request->validated());

        return ApiResponse::success(OfferingRoundData::fromModel($round));
    }

    public function submitReview(OfferingRound $round): JsonResponse
    {
        return ApiResponse::success(
            OfferingRoundData::fromModel($this->roundService->submitReview(request()->user(), $round)),
        );
    }

    public function goLive(OfferingRound $round): JsonResponse
    {
        return ApiResponse::success(
            OfferingRoundData::fromModel($this->roundService->goLive(request()->user(), $round)),
        );
    }

    public function close(OfferingRound $round): JsonResponse
    {
        return ApiResponse::success(
            OfferingRoundData::fromModel($this->roundService->close(request()->user(), $round)),
        );
    }
}
