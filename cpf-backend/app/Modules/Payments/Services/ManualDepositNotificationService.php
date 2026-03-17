<?php

namespace App\Modules\Payments\Services;

use App\Modules\Engagement\Domain\Models\Notification;
use App\Modules\Payments\Domain\Models\ManualDepositRequest;

class ManualDepositNotificationService
{
    public function submitted(ManualDepositRequest $request): void
    {
        $this->create(
            $request,
            type: 'manual_deposit_submitted',
            title: 'Заявка на ручное пополнение создана',
            body: sprintf(
                'Переведите %s по реквизитам заявки %s и загрузите подтверждение платежа.',
                number_format($request->amount, 0, '.', ' ')." ₽",
                $request->reference_code,
            ),
        );
    }

    public function clarificationRequested(ManualDepositRequest $request): void
    {
        $this->create(
            $request,
            type: 'manual_deposit_clarification',
            title: 'Нужно уточнение по пополнению',
            body: $request->review_note ?: 'Менеджер запросил уточнение по вашему переводу.',
        );
    }

    public function credited(ManualDepositRequest $request): void
    {
        $this->create(
            $request,
            type: 'manual_deposit_credited',
            title: 'Пополнение зачислено',
            body: sprintf(
                'Заявка %s подтверждена, %s зачислены на ваш кошелёк.',
                $request->reference_code,
                number_format($request->amount, 0, '.', ' ')." ₽",
            ),
        );
    }

    public function rejected(ManualDepositRequest $request): void
    {
        $this->create(
            $request,
            type: 'manual_deposit_rejected',
            title: 'Заявка на пополнение отклонена',
            body: $request->review_note ?: 'Менеджер отклонил заявку на ручное пополнение.',
        );
    }

    private function create(ManualDepositRequest $request, string $type, string $title, string $body): void
    {
        Notification::query()->create([
            'user_id' => $request->user_id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'action_url' => '/app/investor/wallet',
            'payload' => [
                'manualDepositRequestId' => $request->id,
                'referenceCode' => $request->reference_code,
            ],
        ]);
    }
}
