<?php

namespace App\Modules\Payments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payments\Contracts\PaymentGateway;
use App\Modules\Payments\Data\PaymentTransactionData;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use App\Modules\Payments\Http\Requests\CreateDepositRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class CreateDepositController extends Controller
{
    public function __construct(
        private readonly PaymentGateway $paymentGateway,
    ) {}

    public function store(CreateDepositRequest $request): JsonResponse
    {
        $idempotencyKey = $request->header('Idempotency-Key');

        $existing = PaymentTransaction::query()
            ->where('idempotency_key', $idempotencyKey)
            ->first();

        if ($existing !== null) {
            return ApiResponse::success(PaymentTransactionData::fromModel($existing));
        }

        $transaction = $this->paymentGateway->createDeposit(
            $request->user(),
            $request->integer('amount'),
            $idempotencyKey,
        );

        return ApiResponse::success($transaction, 201);
    }
}
