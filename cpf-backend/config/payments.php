<?php

use App\Modules\Payments\Services\YooKassaPaymentGateway;

return [
    'default' => env('PAYMENT_GATEWAY', 'yookassa'),
    'gateways' => [
        'yookassa' => YooKassaPaymentGateway::class,
    ],

    'yookassa' => [
        'shop_id' => env('YOOKASSA_SHOP_ID'),
        'secret_key' => env('YOOKASSA_SECRET_KEY'),
        'currency' => env('YOOKASSA_CURRENCY', 'RUB'),
        'capture' => (bool) env('YOOKASSA_CAPTURE', true),
        'return_url' => env('YOOKASSA_RETURN_URL', env('FRONTEND_URL', 'http://localhost:3000').'/app/investor/wallet'),
        'payouts_enabled' => (bool) env('YOOKASSA_PAYOUTS_ENABLED', false),
        'verify_webhook_source' => (bool) env('YOOKASSA_VERIFY_WEBHOOK_SOURCE', true),
        'webhook_trusted_ips' => array_values(array_filter(array_map(
            static fn (string $value): string => trim($value),
            explode(',', (string) env(
                'YOOKASSA_WEBHOOK_TRUSTED_IPS',
                '185.71.76.0/27,185.71.77.0/27,77.75.153.0/25,77.75.154.128/25,2a02:5180::/32',
            )),
        ))),
    ],
];
