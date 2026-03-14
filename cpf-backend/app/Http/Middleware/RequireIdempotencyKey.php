<?php

namespace App\Http\Middleware;

use App\Support\Http\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireIdempotencyKey
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->headers->has('Idempotency-Key')) {
            return ApiResponse::error(
                code: 'idempotency_key_required',
                message: 'Для финансовой операции требуется заголовок Idempotency-Key.',
                status: Response::HTTP_UNPROCESSABLE_ENTITY,
                traceId: $request->attributes->get('trace_id'),
            );
        }

        return $next($request);
    }
}
