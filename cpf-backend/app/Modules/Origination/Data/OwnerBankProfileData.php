<?php

namespace App\Modules\Origination\Data;

use App\Modules\Origination\Domain\Models\OwnerBankProfile;
use Spatie\LaravelData\Data;

class OwnerBankProfileData extends Data
{
    public function __construct(
        public string $id,
        public string $payoutMethod,
        public string $status,
        public ?string $recipientName,
        public ?string $bankName,
        public ?string $bankBik,
        public ?string $bankAccount,
        public ?string $correspondentAccount,
        public ?string $maskedBankAccount,
        public ?string $notes,
    ) {}

    public static function fromModel(?OwnerBankProfile $bankProfile): self
    {
        $account = $bankProfile?->bank_account;

        return new self(
            id: $bankProfile?->id ?? '',
            payoutMethod: $bankProfile?->payout_method ?? 'bank_transfer',
            status: $bankProfile?->status ?? 'draft',
            recipientName: $bankProfile?->recipient_name,
            bankName: $bankProfile?->bank_name,
            bankBik: $bankProfile?->bank_bik,
            bankAccount: $account,
            correspondentAccount: $bankProfile?->correspondent_account,
            maskedBankAccount: $account ? sprintf('•••• %s', substr($account, -4)) : null,
            notes: $bankProfile?->notes,
        );
    }
}
