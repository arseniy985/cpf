<?php

namespace App\Modules\Payments\Services;

use App\Models\User;

class WalletBalanceCalculator
{
    public function availableForUser(User $user): int
    {
        $postedCredits = $user->walletTransactions
            ->where('status', 'posted')
            ->where('direction', 'credit')
            ->sum('amount');

        $postedDebits = $user->walletTransactions
            ->where('status', 'posted')
            ->where('direction', 'debit')
            ->sum('amount');

        $reservedDebits = $user->walletTransactions
            ->where('status', 'pending')
            ->where('direction', 'debit')
            ->sum('amount');

        return max(0, (int) $postedCredits - (int) $postedDebits - (int) $reservedDebits);
    }

    public function availableByUserId(int $userId): int
    {
        $user = User::query()
            ->with(['walletTransactions'])
            ->findOrFail($userId);

        return $this->availableForUser($user);
    }
}
