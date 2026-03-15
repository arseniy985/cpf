<?php

namespace App\Filament\Pages;

use App\Modules\Compliance\Domain\Models\KycDocument;
use App\Modules\Identity\Domain\Models\KycProfile;
use App\Modules\Payments\Domain\Models\ManualDepositRequest;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use App\Modules\Payments\Domain\Models\WithdrawalRequest;
use BackedEnum;
use Filament\Pages\Page;
use UnitEnum;

class OperationsQueue extends Page
{
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static ?string $navigationLabel = 'Очередь обработки';

    protected static string|UnitEnum|null $navigationGroup = 'Контроль';

    protected string $view = 'filament.pages.operations-queue';

    public function getViewData(): array
    {
        return [
            'pendingKycProfiles' => KycProfile::query()->where('status', 'pending_review')->count(),
            'pendingKycDocuments' => KycDocument::query()->where('status', 'pending_review')->count(),
            'pendingWithdrawals' => WithdrawalRequest::query()->where('status', 'pending_review')->count(),
            'pendingManualDeposits' => ManualDepositRequest::query()->whereIn('status', ['under_review', 'approved', 'awaiting_user_clarification'])->count(),
            'pendingPayments' => PaymentTransaction::query()->whereIn('status', ['pending', 'waiting_for_capture'])->count(),
        ];
    }
}
