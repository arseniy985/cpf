<?php

return [
    'expires_after_hours' => (int) env('MANUAL_DEPOSIT_EXPIRES_AFTER_HOURS', 72),
    'bank' => [
        'recipient_name' => env('MANUAL_DEPOSIT_RECIPIENT_NAME', 'ООО CPF Capital'),
        'bank_name' => env('MANUAL_DEPOSIT_BANK_NAME', 'АО Банк Партнер'),
        'bank_account' => env('MANUAL_DEPOSIT_BANK_ACCOUNT', '40702810900000000099'),
        'bank_bik' => env('MANUAL_DEPOSIT_BANK_BIK', '044525225'),
        'correspondent_account' => env('MANUAL_DEPOSIT_CORRESPONDENT_ACCOUNT', '30101810400000000225'),
    ],
    'manager' => [
        'name' => env('MANUAL_DEPOSIT_MANAGER_NAME', 'Менеджер CPF'),
        'email' => env('MANUAL_DEPOSIT_MANAGER_EMAIL', 'payments@cpf.local'),
        'phone' => env('MANUAL_DEPOSIT_MANAGER_PHONE', '+7 999 000 00 10'),
        'telegram' => env('MANUAL_DEPOSIT_MANAGER_TELEGRAM', '@cpf_payments'),
    ],
];
