<?php

namespace App\Modules\Payments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payments\Data\PaymentTransactionData;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class PaymentTransactionController extends Controller
{
    public function index(): JsonResponse
    {
        $transactions = request()->user()
            ->paymentTransactions()
            ->latest()
            ->get();

        return ApiResponse::success(PaymentTransactionData::collect($transactions));
    }

    public function show(PaymentTransaction $paymentTransaction): JsonResponse
    {
        abort_unless($paymentTransaction->user_id === request()->user()->id, 404);

        return ApiResponse::success(PaymentTransactionData::fromModel($paymentTransaction));
    }
}
