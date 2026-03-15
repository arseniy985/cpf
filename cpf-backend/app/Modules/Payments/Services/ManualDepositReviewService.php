<?php

namespace App\Modules\Payments\Services;

use App\Models\User;
use App\Modules\Payments\Domain\Models\ManualDepositRequest;
use Illuminate\Support\Facades\DB;

class ManualDepositReviewService
{
    public function __construct(
        private readonly WalletLedgerService $walletLedgerService,
        private readonly ManualDepositNotificationService $notificationService,
    ) {}

    public function markUnderReview(ManualDepositRequest $request, User $reviewer, ?string $note = null): ManualDepositRequest
    {
        return $this->touchReviewState($request, $reviewer, 'under_review', $note);
    }

    public function requestClarification(ManualDepositRequest $request, User $reviewer, string $note): ManualDepositRequest
    {
        $request = $this->touchReviewState($request, $reviewer, 'awaiting_user_clarification', $note);
        $this->notificationService->clarificationRequested($request);

        return $request;
    }

    public function approve(ManualDepositRequest $request, User $reviewer, string $note): ManualDepositRequest
    {
        return $this->touchReviewState($request, $reviewer, 'approved', $note, approvedAt: now());
    }

    public function reject(ManualDepositRequest $request, User $reviewer, string $note): ManualDepositRequest
    {
        $request = $this->touchReviewState($request, $reviewer, 'rejected', $note);
        $this->notificationService->rejected($request);

        return $request;
    }

    public function credit(ManualDepositRequest $request, User $reviewer, string $note): ManualDepositRequest
    {
        return DB::transaction(function () use ($request, $reviewer, $note): ManualDepositRequest {
            /** @var ManualDepositRequest $locked */
            $locked = ManualDepositRequest::query()
                ->with(['user', 'walletTransaction'])
                ->lockForUpdate()
                ->findOrFail($request->id);

            if ($locked->wallet_transaction_id !== null && $locked->status === 'credited') {
                return $locked;
            }

            $walletTransaction = $this->walletLedgerService->firstOrCreateForReference(
                user: $locked->user,
                type: 'deposit',
                direction: 'credit',
                amount: $locked->amount,
                status: 'posted',
                reference: $locked,
                description: 'Ручное пополнение баланса по заявке менеджеру',
                meta: [
                    'reference_code' => $locked->reference_code,
                ],
            );

            $locked->forceFill([
                'status' => 'credited',
                'review_note' => $note,
                'reviewed_at' => now(),
                'approved_at' => $locked->approved_at ?? now(),
                'credited_at' => now(),
                'reviewed_by' => $reviewer->id,
                'wallet_transaction_id' => $walletTransaction->id,
            ])->save();

            $fresh = $locked->fresh();
            $this->notificationService->credited($fresh);

            return $fresh;
        });
    }

    private function touchReviewState(
        ManualDepositRequest $request,
        User $reviewer,
        string $status,
        ?string $note = null,
        $approvedAt = null,
    ): ManualDepositRequest {
        $request->forceFill([
            'status' => $status,
            'review_note' => $note,
            'reviewed_at' => now(),
            'approved_at' => $approvedAt,
            'reviewed_by' => $reviewer->id,
        ])->save();

        return $request->fresh();
    }
}
