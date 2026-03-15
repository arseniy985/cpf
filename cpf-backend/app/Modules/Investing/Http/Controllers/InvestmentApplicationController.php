<?php

namespace App\Modules\Investing\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Investing\Domain\Models\InvestorAllocation;
use App\Modules\Investing\Data\InvestmentApplicationData;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use App\Modules\Investing\Http\Requests\StoreInvestmentApplicationRequest;
use App\Modules\Origination\Services\OfferingRoundService;
use App\Modules\Payments\Domain\Models\WalletTransaction;
use App\Modules\Payments\Services\WalletBalanceCalculator;
use App\Modules\Payments\Services\WalletLedgerService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class InvestmentApplicationController extends Controller
{
    public function __construct(
        private readonly OfferingRoundService $roundService,
    ) {}

    public function index(): JsonResponse
    {
        $applications = request()->user()
            ->investmentApplications()
            ->with(['project.documents', 'round'])
            ->latest()
            ->get();

        return ApiResponse::success(InvestmentApplicationData::collect($applications));
    }

    public function show(InvestmentApplication $investmentApplication): JsonResponse
    {
        abort_unless($investmentApplication->user_id === request()->user()->id, 404);

        if ($investmentApplication->status === 'confirmed') {
            $investmentApplication->load(['project.documents', 'round']);

            return ApiResponse::success(InvestmentApplicationData::fromModel($investmentApplication));
        }

        $investmentApplication->load(['project.documents', 'round']);

        return ApiResponse::success(InvestmentApplicationData::fromModel($investmentApplication));
    }

    public function store(StoreInvestmentApplicationRequest $request): JsonResponse
    {
        $project = Project::query()
            ->published()
            ->findOrFail($request->string('project_id')->toString());
        $round = $this->roundService->ensureAcceptingRound($project);

        if (! $round) {
            return ApiResponse::error(
                code: 'round_not_available',
                message: 'Сейчас по проекту нет открытого раунда для новых заявок.',
                status: Response::HTTP_UNPROCESSABLE_ENTITY,
                traceId: $request->attributes->get('trace_id'),
            );
        }

        if ($request->integer('amount') < $round->min_investment) {
            throw ValidationException::withMessages([
                'amount' => ['Сумма ниже минимального чека для выбранного раунда.'],
            ]);
        }

        $application = InvestmentApplication::query()->create([
            'user_id' => $request->user()->id,
            'project_id' => $project->id,
            'offering_round_id' => $round->id,
            'amount' => $request->integer('amount'),
            'notes' => $request->input('notes'),
            'status' => 'pending',
        ]);

        $application->load(['project.documents', 'round']);

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

        return DB::transaction(function () use (
            $investmentApplication,
            $walletBalanceCalculator,
            $walletLedgerService,
        ): JsonResponse {
            $lockedApplication = InvestmentApplication::query()
                ->whereKey($investmentApplication->id)
                ->lockForUpdate()
                ->firstOrFail();

            $lockedApplication->loadMissing('round', 'project');

            if ($lockedApplication->status === 'confirmed') {
                $lockedApplication->load(['project.documents', 'round']);

                return ApiResponse::success(InvestmentApplicationData::fromModel($lockedApplication));
            }

            $lockedRound = $lockedApplication->round()
                ->lockForUpdate()
                ->first();

            if (! $lockedRound || ! in_array($lockedRound->status, ['live', 'fully_allocated'], true)) {
                return ApiResponse::error(
                    code: 'round_not_live',
                    message: 'Подтверждение возможно только для активного раунда.',
                    status: Response::HTTP_UNPROCESSABLE_ENTITY,
                    traceId: request()->attributes->get('trace_id'),
                );
            }

            if ($lockedApplication->project()->where('status', 'published')->doesntExist()) {
                return ApiResponse::error(
                    code: 'project_not_available',
                    message: 'Инвестирование доступно только по опубликованным проектам.',
                    status: Response::HTTP_UNPROCESSABLE_ENTITY,
                    traceId: request()->attributes->get('trace_id'),
                );
            }

            $lockedWalletTransactions = WalletTransaction::query()
                ->where('user_id', request()->user()->id)
                ->lockForUpdate()
                ->get();

            if ($walletBalanceCalculator->availableFromTransactions($lockedWalletTransactions) < $lockedApplication->amount) {
                return ApiResponse::error(
                    code: 'insufficient_wallet_balance',
                    message: 'Недостаточно средств на балансе для подтверждения участия.',
                    status: Response::HTTP_UNPROCESSABLE_ENTITY,
                    traceId: request()->attributes->get('trace_id'),
                );
            }

            if ($lockedApplication->amount < $lockedRound->min_investment) {
                return ApiResponse::error(
                    code: 'round_min_investment_not_met',
                    message: 'Сумма ниже минимального чека для выбранного раунда.',
                    status: Response::HTTP_UNPROCESSABLE_ENTITY,
                    traceId: request()->attributes->get('trace_id'),
                );
            }

            if (! $this->roundService->canConfirmAmount($lockedRound, $lockedApplication->amount)) {
                return ApiResponse::error(
                    code: 'round_limit_exceeded',
                    message: 'Раунд уже почти закрыт, текущая сумма превышает доступный остаток.',
                    status: Response::HTTP_UNPROCESSABLE_ENTITY,
                    traceId: request()->attributes->get('trace_id'),
                );
            }

            $lockedApplication->forceFill([
                'status' => 'confirmed',
                'confirmed_at' => now(),
                'agreement_url' => $lockedApplication->agreement_url ?: url('/agreements/'.$lockedApplication->id),
            ])->save();

            $walletLedgerService->firstOrCreateForReference(
                user: request()->user(),
                type: 'investment',
                direction: 'debit',
                amount: $lockedApplication->amount,
                status: 'posted',
                reference: $lockedApplication,
                description: 'Подтверждение участия в проекте',
            );

            InvestorAllocation::query()->firstOrCreate(
                ['investment_application_id' => $lockedApplication->id],
                [
                    'offering_round_id' => $lockedApplication->offering_round_id,
                    'project_id' => $lockedApplication->project_id,
                    'user_id' => $lockedApplication->user_id,
                    'amount' => $lockedApplication->amount,
                    'status' => 'confirmed',
                    'agreement_url' => $lockedApplication->agreement_url,
                    'allocated_at' => now(),
                ],
            );

            $this->roundService->registerConfirmedAmount($lockedRound, $lockedApplication->amount);

            $lockedProject = Project::query()
                ->whereKey($lockedApplication->project_id)
                ->lockForUpdate()
                ->firstOrFail();

            $lockedProject->forceFill([
                'current_amount' => $lockedProject->current_amount + $lockedApplication->amount,
            ])->save();

            $lockedApplication->load(['project.documents', 'round']);

            return ApiResponse::success(InvestmentApplicationData::fromModel($lockedApplication));
        });
    }
}
