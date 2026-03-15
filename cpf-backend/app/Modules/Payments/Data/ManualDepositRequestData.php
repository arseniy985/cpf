<?php

namespace App\Modules\Payments\Data;

use App\Modules\Payments\Domain\Models\ManualDepositRequest;
use Spatie\LaravelData\Data;

class ManualDepositRequestData extends Data
{
    public function __construct(
        public string $id,
        public int $amount,
        public string $currency,
        public string $status,
        public string $referenceCode,
        public string $recipientName,
        public string $bankName,
        public string $bankAccount,
        public ?string $bankBik,
        public ?string $correspondentAccount,
        public string $paymentPurpose,
        public ?string $managerName,
        public ?string $managerEmail,
        public ?string $managerPhone,
        public ?string $managerTelegram,
        public string $payerName,
        public ?string $payerBank,
        public ?string $payerAccountLast4,
        public ?string $comment,
        public ?string $reviewNote,
        public ?string $receiptDownloadUrl,
        public string $createdAt,
        public ?string $submittedAt,
        public ?string $receiptUploadedAt,
        public ?string $reviewedAt,
        public ?string $approvedAt,
        public ?string $creditedAt,
        public ?string $cancelledAt,
        public ?string $expiresAt,
    ) {}

    public static function fromModel(ManualDepositRequest $request): self
    {
        return new self(
            id: $request->id,
            amount: $request->amount,
            currency: $request->currency,
            status: $request->status,
            referenceCode: $request->reference_code,
            recipientName: $request->recipient_name,
            bankName: $request->bank_name,
            bankAccount: $request->bank_account,
            bankBik: $request->bank_bik,
            correspondentAccount: $request->correspondent_account,
            paymentPurpose: $request->payment_purpose,
            managerName: $request->manager_name,
            managerEmail: $request->manager_email,
            managerPhone: $request->manager_phone,
            managerTelegram: $request->manager_telegram,
            payerName: $request->payer_name,
            payerBank: $request->payer_bank,
            payerAccountLast4: $request->payer_account_last4,
            comment: $request->comment,
            reviewNote: $request->review_note,
            receiptDownloadUrl: $request->receipt_path
                ? route('manual-deposits.receipt.download', $request)
                : null,
            createdAt: $request->created_at->toAtomString(),
            submittedAt: $request->submitted_at?->toAtomString(),
            receiptUploadedAt: $request->receipt_uploaded_at?->toAtomString(),
            reviewedAt: $request->reviewed_at?->toAtomString(),
            approvedAt: $request->approved_at?->toAtomString(),
            creditedAt: $request->credited_at?->toAtomString(),
            cancelledAt: $request->cancelled_at?->toAtomString(),
            expiresAt: $request->expires_at?->toAtomString(),
        );
    }
}
