<?php

namespace App\Modules\Investing\Data;

use App\Models\User;
use App\Modules\Payments\Services\WalletBalanceCalculator;
use Spatie\LaravelData\Data;

class InvestorDashboardData extends Data
{
    public function __construct(
        public int $applicationsCount,
        public int $allocationsCount,
        public int $portfolioAmount,
        public int $approvedAmount,
        public int $pendingAmount,
        public int $distributionsAmount,
        public int $walletBalance,
        public int $pendingWithdrawals,
        public int $pendingManualDeposits,
        public int $unreadNotifications,
        public ?string $kycStatus,
    ) {}

    public static function fromUser(User $user): self
    {
        $applications = $user->investmentApplications;
        $allocations = $user->investorAllocations;
        $distributionLines = $user->distributionLines;
        $walletBalance = app(WalletBalanceCalculator::class)->availableForUser($user);

        return new self(
            applicationsCount: $applications->count(),
            allocationsCount: $allocations->count(),
            portfolioAmount: (int) $allocations->sum('amount'),
            approvedAmount: (int) $applications->whereIn('status', ['approved', 'confirmed'])->sum('amount'),
            pendingAmount: (int) $applications->where('status', 'pending')->sum('amount'),
            distributionsAmount: (int) $distributionLines->sum('amount'),
            walletBalance: $walletBalance,
            pendingWithdrawals: (int) $user->withdrawalRequests->whereIn('status', ['pending_review', 'approved', 'processing_manual_payout'])->sum('amount'),
            pendingManualDeposits: (int) $user->manualDepositRequests->whereIn('status', [
                'awaiting_transfer',
                'under_review',
                'awaiting_user_clarification',
                'approved',
            ])->sum('amount'),
            unreadNotifications: $user->notifications->whereNull('read_at')->count(),
            kycStatus: $user->kycProfile?->status,
        );
    }
}
