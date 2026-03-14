<x-filament-panels::page>
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        @foreach ([
            ['label' => 'KYC профили', 'value' => $pendingKycProfiles],
            ['label' => 'KYC документы', 'value' => $pendingKycDocuments],
            ['label' => 'Выводы', 'value' => $pendingWithdrawals],
            ['label' => 'Заявки по проектам', 'value' => $pendingProjectSubmissions],
            ['label' => 'Платежи', 'value' => $pendingPayments],
        ] as $card)
            <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ $card['label'] }}</div>
                <div class="mt-3 text-3xl font-semibold tracking-tight">{{ $card['value'] }}</div>
            </div>
        @endforeach
    </div>
</x-filament-panels::page>
