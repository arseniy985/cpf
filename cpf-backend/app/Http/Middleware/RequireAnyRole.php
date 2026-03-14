<?php

namespace App\Http\Middleware;

use App\Support\Http\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireAnyRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || $roles === [] || ! $user->hasAnyRole($roles)) {
            return ApiResponse::error(
                code: 'forbidden',
                message: 'Недостаточно прав для выполнения операции.',
                status: Response::HTTP_FORBIDDEN,
                traceId: $request->attributes->get('trace_id'),
            );
        }

        return $next($request);
    }
}
