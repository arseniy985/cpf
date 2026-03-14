<?php

namespace App\Modules\Payments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payments\Data\WithdrawalRequestData;
use App\Modules\Payments\Domain\Models\WithdrawalRequest;
use App\Modules\Payments\Http\Requests\StoreWithdrawalRequest;
use App\Modules\Payments\Services\WalletBalanceCalculator;
use App\Modules\Payments\Services\WalletLedgerService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class WithdrawalRequestController extends Controller
{
    public function index(): JsonResponse
    {
        $requests = request()->user()->withdrawalRequests()->latest()->get();

        return ApiResponse::success(WithdrawalRequestData::collect($requests));
    }

    public function show(WithdrawalRequest $withdrawalRequest): JsonResponse
    {
        abort_unless($withdrawalRequest->user_id === request()->user()->id, 404);

        return ApiResponse::success(WithdrawalRequestData::fromModel($withdrawalRequest));
    }

    public function store(
        StoreWithdrawalRequest $request,
        WalletBalanceCalculator $walletBalanceCalculator,
        WalletLedgerService $walletLedgerService,
    ): JsonResponse {
        $idempotencyKey = $request->header('Idempotency-Key');

        $existing = WithdrawalRequest::query()
            ->where('idempotency_key', $idempotencyKey)
            ->first();

        if ($existing !== null) {
            return ApiResponse::success(WithdrawalRequestData::fromModel($existing));
        }

        $available = $walletBalanceCalculator->availableForUser(
            $request->user()->load(['walletTransactions']),
        );

        if ($request->integer('amount') > $available) {
            return ApiResponse::error(
                code: 'insufficient_wallet_balance',
                message: 'Недостаточно доступного баланса для вывода.',
                status: Response::HTTP_UNPROCESSABLE_ENTITY,
                traceId: $request->attributes->get('trace_id'),
            );
        }

        $walletTransaction = $walletLedgerService->create(
            user: $request->user(),
            type: 'withdrawal',
            direction: 'debit',
            amount: $request->integer('amount'),
            status: 'pending',
            description: 'Резерв под заявку на вывод',
        );

        $withdrawalRequest = WithdrawalRequest::query()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'status' => 'pending_review',
            'idempotency_key' => $idempotencyKey,
            'wallet_transaction_id' => $walletTransaction->id,
        ]);

        return ApiResponse::success(WithdrawalRequestData::fromModel($withdrawalRequest), Response::HTTP_CREATED);
    }

    public function cancel(WithdrawalRequest $withdrawalRequest): JsonResponse
    {
        abort_unless($withdrawalRequest->user_id === request()->user()->id, 404);

        if (! in_array($withdrawalRequest->status, ['pending_review', 'approved'], true)) {
            return ApiResponse::error(
                code: 'withdrawal_cannot_be_cancelled',
                message: 'Заявка уже находится в необратимом статусе.',
                status: Response::HTTP_UNPROCESSABLE_ENTITY,
                traceId: request()->attributes->get('trace_id'),
            );
        }

        $withdrawalRequest->forceFill([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ])->save();
        $withdrawalRequest->walletTransaction?->forceFill(['status' => 'voided'])->save();

        return ApiResponse::success(WithdrawalRequestData::fromModel($withdrawalRequest));
    }
}
