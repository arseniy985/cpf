<?php

namespace App\Filament\Resources\PaymentTransactions\Pages;

use App\Filament\Resources\PaymentTransactions\PaymentTransactionResource;
use Filament\Resources\Pages\ManageRecords;

class ManagePaymentTransactions extends ManageRecords
{
    protected static string $resource = PaymentTransactionResource::class;
}
