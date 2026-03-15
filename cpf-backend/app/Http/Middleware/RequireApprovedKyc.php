<?php

namespace App\Http\Middleware;

use App\Support\Http\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireApprovedKyc
{
    public function handle(Request $request, Closure $next): Response
    {
        $status = $request->user()?->loadMissing('kycProfile')->kycProfile?->status;

        if ($status !== 'approved') {
            return ApiResponse::error(
                code: 'kyc_approval_required',
                message: 'Финансовые операции откроются после подтверждения вашей проверки личности.',
                status: Response::HTTP_FORBIDDEN,
                traceId: $request->attributes->get('trace_id'),
            );
        }

        return $next($request);
    }
}
