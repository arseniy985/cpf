<?php

namespace App\Modules\Investing\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Identity\Data\AuthUserData;
use App\Modules\Investing\Data\InvestmentApplicationData;
use App\Modules\Investing\Data\InvestorDashboardData;
use App\Modules\Payments\Data\PaymentTransactionData;
use App\Modules\Payments\Data\WalletTransactionData;
use App\Modules\Payments\Data\WithdrawalRequestData;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class InvestorDashboardController extends Controller
{
    public function show(): JsonResponse
    {
        $user = request()->user()->load([
            'investmentApplications.project.documents',
            'paymentTransactions',
            'walletTransactions',
            'withdrawalRequests',
            'notifications',
            'kycProfile',
        ]);

        return ApiResponse::success([
            'user' => AuthUserData::fromModel($user),
            'summary' => InvestorDashboardData::fromUser($user),
            'applications' => InvestmentApplicationData::collect($user->investmentApplications),
            'transactions' => PaymentTransactionData::collect(
                $user->paymentTransactions->sortByDesc('created_at')->values(),
            ),
            'walletTransactions' => WalletTransactionData::collect(
                $user->walletTransactions->sortByDesc('occurred_at')->values(),
            ),
            'withdrawals' => WithdrawalRequestData::collect(
                $user->withdrawalRequests->sortByDesc('created_at')->values(),
            ),
        ]);
    }
}
