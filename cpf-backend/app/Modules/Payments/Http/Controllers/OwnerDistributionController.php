<?php

namespace App\Modules\Payments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Payments\Data\DistributionData;
use App\Modules\Payments\Data\PayoutInstructionData;
use App\Modules\Payments\Domain\Models\Distribution;
use App\Modules\Payments\Domain\Models\PayoutInstruction;
use App\Modules\Payments\Http\Requests\StoreDistributionRequest;
use App\Modules\Payments\Services\DistributionService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OwnerDistributionController extends Controller
{
    public function __construct(
        private readonly DistributionService $distributionService,
    ) {}

    public function index(OfferingRound $round): JsonResponse
    {
        abort_unless($round->ownerAccount->members()->where('user_id', request()->user()->id)->exists(), 404);
        $round->load([
            'distributions.round',
            'distributions.lines.allocation.round',
            'distributions.lines.allocation.project',
            'distributions.lines.allocation.user',
            'distributions.lines.payoutInstruction',
        ]);

        return ApiResponse::success(DistributionData::collect($round->distributions));
    }

    public function store(StoreDistributionRequest $request, OfferingRound $round): JsonResponse
    {
        abort_unless($round->ownerAccount->members()->where('user_id', request()->user()->id)->exists(), 404);
        $distribution = $this->distributionService->createForRound($round, $request->validated());

        return ApiResponse::success(DistributionData::fromModel($distribution), Response::HTTP_CREATED);
    }

    public function show(Distribution $distribution): JsonResponse
    {
        abort_unless($distribution->ownerAccount->members()->where('user_id', request()->user()->id)->exists(), 404);
        $distribution->load([
            'round',
            'lines.allocation.round',
            'lines.allocation.project',
            'lines.allocation.user',
            'lines.payoutInstruction',
        ]);

        return ApiResponse::success(DistributionData::fromModel($distribution));
    }

    public function approve(Distribution $distribution): JsonResponse
    {
        abort_unless($distribution->ownerAccount->members()->where('user_id', request()->user()->id)->exists(), 404);
        return ApiResponse::success(DistributionData::fromModel($this->distributionService->approve($distribution)));
    }

    public function runPayouts(Distribution $distribution): JsonResponse
    {
        abort_unless($distribution->ownerAccount->members()->where('user_id', request()->user()->id)->exists(), 404);
        return ApiResponse::success(DistributionData::fromModel($this->distributionService->dispatch($distribution)));
    }

    public function payouts(): JsonResponse
    {
        $ownerAccountIds = request()->user()
            ->ownerMemberships()
            ->pluck('owner_account_id');

        $instructions = PayoutInstruction::query()
            ->whereHas('distribution', fn ($query) => $query->whereIn('owner_account_id', $ownerAccountIds))
            ->with('distribution')
            ->latest()
            ->get();

        return ApiResponse::success(PayoutInstructionData::collect($instructions));
    }
}
