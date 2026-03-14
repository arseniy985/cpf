<?php

namespace App\Modules\Payments\Data;

use App\Modules\Payments\Domain\Models\WithdrawalRequest;
use Spatie\LaravelData\Data;

class WithdrawalRequestData extends Data
{
    public function __construct(
        public string $id,
        public int $amount,
        public string $status,
        public string $bankName,
        public string $bankAccount,
        public ?string $comment,
        public ?string $reviewNote,
        public string $createdAt,
        public ?string $reviewedAt,
        public ?string $paidAt,
        public ?string $cancelledAt,
    ) {}

    public static function fromModel(WithdrawalRequest $request): self
    {
        return new self(
            id: $request->id,
            amount: $request->amount,
            status: $request->status,
            bankName: $request->bank_name,
            bankAccount: $request->bank_account,
            comment: $request->comment,
            reviewNote: $request->review_note,
            createdAt: $request->created_at->toAtomString(),
            reviewedAt: $request->reviewed_at?->toAtomString(),
            paidAt: $request->paid_at?->toAtomString(),
            cancelledAt: $request->cancelled_at?->toAtomString(),
        );
    }
}
