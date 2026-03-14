<?php

namespace App\Modules\Payments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payments\Services\PaymentSyncService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentWebhookController extends Controller
{
    public function handleYooKassa(Request $request, PaymentSyncService $paymentSyncService): JsonResponse
    {
        $externalId = data_get($request->input('object'), 'id');

        abort_unless(is_string($externalId) && $externalId !== '', 422);

        $transaction = $paymentSyncService->syncByExternalId($externalId);

        return ApiResponse::success([
            'transactionId' => $transaction->id,
            'status' => $transaction->status,
        ]);
    }
}
