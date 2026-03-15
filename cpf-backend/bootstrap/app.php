<?php

use App\Http\Middleware\AssignTraceId;
use App\Http\Middleware\RequireAnyRole;
use App\Http\Middleware\RequireApprovedKyc;
use App\Http\Middleware\RequireApprovedOwnerOnboarding;
use App\Http\Middleware\RequireIdempotencyKey;
use App\Http\Middleware\VerifyYooKassaWebhookSource;
use App\Support\Http\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role.any' => RequireAnyRole::class,
            'idempotency' => RequireIdempotencyKey::class,
            'kyc.approved' => RequireApprovedKyc::class,
            'kyb.approved' => RequireApprovedOwnerOnboarding::class,
            'yookassa.webhook' => VerifyYooKassaWebhookSource::class,
        ]);

        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR
                | Request::HEADER_X_FORWARDED_HOST
                | Request::HEADER_X_FORWARDED_PORT
                | Request::HEADER_X_FORWARDED_PROTO
                | Request::HEADER_X_FORWARDED_AWS_ELB,
        );

        $middleware->api(prepend: [
            AssignTraceId::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                code: 'validation_error',
                message: 'Данные не прошли валидацию.',
                status: $exception->status,
                details: $exception->errors(),
                traceId: $request->attributes->get('trace_id'),
            );
        });

        $exceptions->render(function (AuthenticationException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                code: 'unauthenticated',
                message: 'Требуется авторизация.',
                status: 401,
                traceId: $request->attributes->get('trace_id'),
            );
        });

        $exceptions->render(function (AuthorizationException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                code: 'forbidden',
                message: $exception->getMessage() ?: 'Недостаточно прав для выполнения операции.',
                status: 403,
                traceId: $request->attributes->get('trace_id'),
            );
        });

        $exceptions->render(function (NotFoundHttpException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                code: 'not_found',
                message: 'Запрашиваемый ресурс не найден.',
                status: 404,
                traceId: $request->attributes->get('trace_id'),
            );
        });

        $exceptions->render(function (TooManyRequestsHttpException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                code: 'too_many_requests',
                message: 'Слишком много попыток. Подождите немного и повторите действие.',
                status: 429,
                traceId: $request->attributes->get('trace_id'),
            );
        });

        $exceptions->render(function (UnprocessableEntityHttpException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                code: 'unprocessable_entity',
                message: $exception->getMessage() ?: 'Операция не может быть выполнена.',
                status: 422,
                traceId: $request->attributes->get('trace_id'),
            );
        });

        $exceptions->render(function (Throwable $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            report($exception);

            return ApiResponse::error(
                code: 'server_error',
                message: 'Внутренняя ошибка сервера.',
                status: 500,
                traceId: $request->attributes->get('trace_id'),
            );
        });
    })->create();
