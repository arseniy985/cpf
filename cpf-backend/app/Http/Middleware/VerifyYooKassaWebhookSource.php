<?php

namespace App\Http\Middleware;

use App\Support\Http\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\IpUtils;
use Symfony\Component\HttpFoundation\Response;

class VerifyYooKassaWebhookSource
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! config('payments.yookassa.verify_webhook_source', true)) {
            return $next($request);
        }

        $ip = $request->ip();
        $trustedIps = config('payments.yookassa.webhook_trusted_ips', []);

        if (! is_string($ip) || ! IpUtils::checkIp($ip, $trustedIps)) {
            return ApiResponse::error(
                code: 'invalid_webhook_source',
                message: 'Источник webhook не прошел проверку.',
                status: Response::HTTP_FORBIDDEN,
                traceId: $request->attributes->get('trace_id'),
            );
        }

        return $next($request);
    }
}
