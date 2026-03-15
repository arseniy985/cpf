<?php

namespace App\Modules\Payments\Services;

use App\Models\User;
use Illuminate\Support\Collection;

class WalletBalanceCalculator
{
    public function availableForUser(User $user): int
    {
        return $this->availableFromTransactions($user->walletTransactions);
    }

    /**
     * @param  Collection<int, \App\Modules\Payments\Domain\Models\WalletTransaction>  $transactions
     */
    public function availableFromTransactions(Collection $transactions): int
    {
        $postedCredits = $transactions
            ->where('status', 'posted')
            ->where('direction', 'credit')
            ->sum('amount');

        $postedDebits = $transactions
            ->where('status', 'posted')
            ->where('direction', 'debit')
            ->sum('amount');

        $reservedDebits = $transactions
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
