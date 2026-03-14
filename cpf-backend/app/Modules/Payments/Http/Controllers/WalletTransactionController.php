<?php

namespace App\Modules\Payments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payments\Data\WalletTransactionData;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class WalletTransactionController extends Controller
{
    public function index(): JsonResponse
    {
        $transactions = request()->user()->walletTransactions()->latest('occurred_at')->get();

        return ApiResponse::success(WalletTransactionData::collect($transactions));
    }
}
