<?php

namespace App\Modules\Investing\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Investing\Data\InvestmentApplicationData;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use App\Modules\Investing\Http\Requests\StoreInvestmentApplicationRequest;
use App\Modules\Payments\Services\WalletBalanceCalculator;
use App\Modules\Payments\Services\WalletLedgerService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class InvestmentApplicationController extends Controller
{
    public function index(): JsonResponse
    {
        $applications = request()->user()
            ->investmentApplications()
            ->with('project.documents')
            ->latest()
            ->get();

        return ApiResponse::success(InvestmentApplicationData::collect($applications));
    }

    public function show(InvestmentApplication $investmentApplication): JsonResponse
    {
        abort_unless($investmentApplication->user_id === request()->user()->id, 404);

        if ($investmentApplication->status === 'confirmed') {
            $investmentApplication->load('project.documents');

            return ApiResponse::success(InvestmentApplicationData::fromModel($investmentApplication));
        }

        $investmentApplication->load('project.documents');

        return ApiResponse::success(InvestmentApplicationData::fromModel($investmentApplication));
    }

    public function store(StoreInvestmentApplicationRequest $request): JsonResponse
    {
        $project = Project::query()->findOrFail($request->string('project_id')->toString());

        $application = InvestmentApplication::query()->create([
            'user_id' => $request->user()->id,
            'project_id' => $project->id,
            'amount' => $request->integer('amount'),
            'notes' => $request->input('notes'),
            'status' => 'pending',
        ]);

        $application->load('project.documents');

        return ApiResponse::success(InvestmentApplicationData::fromModel($application), Response::HTTP_CREATED);
    }

    public function agreement(InvestmentApplication $investmentApplication): JsonResponse
    {
        abort_unless($investmentApplication->user_id === request()->user()->id, 404);

        return ApiResponse::success([
            'investmentId' => $investmentApplication->id,
            'agreementUrl' => $investmentApplication->agreement_url ?: url('/agreements/'.$investmentApplication->id),
        ]);
    }

    public function confirm(
        InvestmentApplication $investmentApplication,
        WalletBalanceCalculator $walletBalanceCalculator,
        WalletLedgerService $walletLedgerService,
    ): JsonResponse {
        abort_unless($investmentApplication->user_id === request()->user()->id, 404);

        if ($walletBalanceCalculator->availableForUser(request()->user()->load([
            'walletTransactions',
        ])) < $investmentApplication->amount) {
            return ApiResponse::error(
                code: 'insufficient_wallet_balance',
                message: 'Недостаточно средств на балансе для подтверждения участия.',
                status: Response::HTTP_UNPROCESSABLE_ENTITY,
                traceId: request()->attributes->get('trace_id'),
            );
        }

        $investmentApplication->forceFill([
            'status' => 'confirmed',
            'confirmed_at' => now(),
            'agreement_url' => $investmentApplication->agreement_url ?: url('/agreements/'.$investmentApplication->id),
        ])->save();

        if (! request()->user()->walletTransactions()
            ->where('reference_type', $investmentApplication::class)
            ->where('reference_id', $investmentApplication->id)
            ->where('type', 'investment')
            ->exists()
        ) {
            $walletLedgerService->create(
                user: request()->user(),
                type: 'investment',
                direction: 'debit',
                amount: $investmentApplication->amount,
                status: 'posted',
                reference: $investmentApplication,
                description: 'Подтверждение участия в проекте',
            );
        }

        $investmentApplication->project()->increment('current_amount', $investmentApplication->amount);
        $investmentApplication->load('project.documents');

        return ApiResponse::success(InvestmentApplicationData::fromModel($investmentApplication));
    }
}
