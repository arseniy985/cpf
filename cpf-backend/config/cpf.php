<?php

return [
    'auth' => [
        'register_with_email_code' => (bool) env('AUTH_REGISTER_WITH_EMAIL_CODE', true),
        'login_with_email_code' => (bool) env('AUTH_LOGIN_WITH_EMAIL_CODE', true),
    ],
];
