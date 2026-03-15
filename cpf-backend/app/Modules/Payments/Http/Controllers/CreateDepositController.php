<?php

namespace App\Modules\Payments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payments\Contracts\PaymentGateway;
use App\Modules\Payments\Data\PaymentTransactionData;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use App\Modules\Payments\Http\Requests\CreateDepositRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class CreateDepositController extends Controller
{
    public function __construct(
        private readonly PaymentGateway $paymentGateway,
    ) {}

    public function store(CreateDepositRequest $request): JsonResponse
    {
        $idempotencyKey = $request->header('Idempotency-Key');
        $existing = $this->findExistingTransaction($request->user()->id, $idempotencyKey);

        if ($existing !== null) {
            return ApiResponse::success(PaymentTransactionData::fromModel($existing));
        }

        try {
            $transaction = $this->paymentGateway->createDeposit(
                $request->user(),
                $request->integer('amount'),
                $idempotencyKey,
            );
        } catch (QueryException $exception) {
            $transaction = $this->findExistingTransaction($request->user()->id, $idempotencyKey);

            if ($transaction === null) {
                throw $exception;
            }
        }

        return ApiResponse::success($transaction, 201);
    }

    private function findExistingTransaction(string $userId, ?string $idempotencyKey): ?PaymentTransaction
    {
        return PaymentTransaction::query()
            ->where('user_id', $userId)
            ->where('idempotency_key', $idempotencyKey)
            ->first();
    }
}
