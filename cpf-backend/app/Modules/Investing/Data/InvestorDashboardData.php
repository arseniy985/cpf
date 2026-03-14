<?php

namespace App\Modules\Investing\Data;

use App\Models\User;
use App\Modules\Payments\Services\WalletBalanceCalculator;
use Spatie\LaravelData\Data;

class InvestorDashboardData extends Data
{
    public function __construct(
        public int $applicationsCount,
        public int $portfolioAmount,
        public int $approvedAmount,
        public int $pendingAmount,
        public int $walletBalance,
        public int $pendingWithdrawals,
        public int $unreadNotifications,
        public ?string $kycStatus,
    ) {}

    public static function fromUser(User $user): self
    {
        $applications = $user->investmentApplications;
        $walletBalance = app(WalletBalanceCalculator::class)->availableForUser($user);

        return new self(
            applicationsCount: $applications->count(),
            portfolioAmount: (int) $applications->sum('amount'),
            approvedAmount: (int) $applications->where('status', 'approved')->sum('amount'),
            pendingAmount: (int) $applications->where('status', 'pending')->sum('amount'),
            walletBalance: $walletBalance,
            pendingWithdrawals: (int) $user->withdrawalRequests->whereIn('status', ['pending_review', 'approved', 'processing_manual_payout'])->sum('amount'),
            unreadNotifications: $user->notifications->whereNull('read_at')->count(),
            kycStatus: $user->kycProfile?->status,
        );
    }
}
