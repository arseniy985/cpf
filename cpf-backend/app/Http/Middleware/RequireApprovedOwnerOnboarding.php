<?php

namespace App\Http\Middleware;

use App\Modules\Origination\Services\OwnerAccountProvisioner;
use App\Support\Http\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireApprovedOwnerOnboarding
{
    public function __construct(
        private readonly OwnerAccountProvisioner $provisioner,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $account = $this->provisioner->ensureForUser($request->user())->loadMissing('onboarding');
        $status = $account->onboarding?->status;

        if (! in_array($status, ['kyb_approved', 'active'], true)) {
            return ApiResponse::error(
                code: 'kyb_approval_required',
                message: 'Запуск раундов и выплаты доступны после одобрения профиля компании.',
                status: Response::HTTP_FORBIDDEN,
                traceId: $request->attributes->get('trace_id'),
            );
        }

        return $next($request);
    }
}
