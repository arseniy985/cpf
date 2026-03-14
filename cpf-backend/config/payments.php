<?php

return [
    'default' => env('PAYMENT_GATEWAY', 'yookassa'),

    'yookassa' => [
        'shop_id' => env('YOOKASSA_SHOP_ID'),
        'secret_key' => env('YOOKASSA_SECRET_KEY'),
        'currency' => env('YOOKASSA_CURRENCY', 'RUB'),
        'capture' => (bool) env('YOOKASSA_CAPTURE', true),
        'return_url' => env('YOOKASSA_RETURN_URL', env('FRONTEND_URL', 'http://localhost:3000').'/dashboard'),
    ],
];
