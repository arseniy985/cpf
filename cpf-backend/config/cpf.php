<?php

return [
    'auth' => [
        'register_with_email_code' => (bool) env('AUTH_REGISTER_WITH_EMAIL_CODE', true),
        'login_with_email_code' => (bool) env('AUTH_LOGIN_WITH_EMAIL_CODE', true),
        'email_code_max_attempts' => (int) env('AUTH_EMAIL_CODE_MAX_ATTEMPTS', 5),
        'throttle' => [
            'login_per_minute' => (int) env('AUTH_LOGIN_PER_MINUTE', 10),
            'email_code_issue_per_ten_minutes' => (int) env('AUTH_EMAIL_CODE_ISSUE_PER_TEN_MINUTES', 5),
            'email_code_verify_per_ten_minutes' => (int) env('AUTH_EMAIL_CODE_VERIFY_PER_TEN_MINUTES', 10),
            'password_reset_per_ten_minutes' => (int) env('AUTH_PASSWORD_RESET_PER_TEN_MINUTES', 5),
        ],
    ],
];
