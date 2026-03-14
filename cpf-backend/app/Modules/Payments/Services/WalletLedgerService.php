<?php

namespace App\Modules\Payments\Services;

use App\Models\User;
use App\Modules\Payments\Domain\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Model;

class WalletLedgerService
{
    public function create(
        User $user,
        string $type,
        string $direction,
        int $amount,
        string $status,
        ?Model $reference = null,
        ?string $description = null,
        array $meta = [],
    ): WalletTransaction {
        return WalletTransaction::query()->create([
            'user_id' => $user->id,
            'type' => $type,
            'direction' => $direction,
            'status' => $status,
            'amount' => $amount,
            'currency' => 'RUB',
            'reference_type' => $reference ? $reference::class : null,
            'reference_id' => $reference?->getKey(),
            'description' => $description,
            'meta' => $meta,
            'occurred_at' => now(),
        ]);
    }

    public function markPosted(WalletTransaction $transaction): void
    {
        $transaction->forceFill(['status' => 'posted'])->save();
    }

    public function markVoided(WalletTransaction $transaction): void
    {
        $transaction->forceFill(['status' => 'voided'])->save();
    }
}
