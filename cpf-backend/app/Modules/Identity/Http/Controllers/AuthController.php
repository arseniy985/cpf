<?php

namespace App\Modules\Identity\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Identity\Data\AuthUserData;
use App\Modules\Identity\Http\Requests\ForgotPasswordRequest;
use App\Modules\Identity\Http\Requests\LoginRequest;
use App\Modules\Identity\Http\Requests\RegisterRequest;
use App\Modules\Identity\Http\Requests\RequestEmailCodeRequest;
use App\Modules\Identity\Http\Requests\ResetPasswordWithCodeRequest;
use App\Modules\Identity\Http\Requests\VerifyEmailCodeRequest;
use App\Modules\Identity\Services\EmailCodeService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(
        private readonly EmailCodeService $emailCodeService,
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create($request->safe()->only(['name', 'email', 'phone', 'password']));
        $user->assignRole('investor');
        $user->load('kycProfile');

        if (! config('cpf.auth.register_with_email_code', true)) {
            $user->forceFill(['email_verified_at' => now(), 'last_login_at' => now()])->save();

            $token = $user->createToken($request->input('device_name', 'web'))->plainTextToken;

            return ApiResponse::success([
                'token' => $token,
                'user' => AuthUserData::fromModel($user),
            ], Response::HTTP_CREATED);
        }

        $this->emailCodeService->issue($user->email, 'verify_email', $user);

        return ApiResponse::success([
            'email' => $user->email,
            'purpose' => 'verify_email',
            'codeSent' => true,
        ], Response::HTTP_CREATED);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->string('email')->toString())->first();

        if (! $user || ! Hash::check($request->string('password')->toString(), $user->password)) {
            return ApiResponse::error(
                code: 'invalid_credentials',
                message: 'Неверные учетные данные.',
                status: Response::HTTP_UNPROCESSABLE_ENTITY,
                traceId: $request->attributes->get('trace_id'),
            );
        }

        $user->forceFill(['last_login_at' => now()])->save();
        $user->load('kycProfile');

        if (! config('cpf.auth.login_with_email_code', true)) {
            $token = $user->createToken($request->input('device_name', 'web'))->plainTextToken;

            return ApiResponse::success([
                'token' => $token,
                'user' => AuthUserData::fromModel($user),
            ]);
        }

        $purpose = $user->email_verified_at ? 'login' : 'verify_email';
        $this->emailCodeService->issue($user->email, $purpose, $user);

        return ApiResponse::success([
            'email' => $user->email,
            'purpose' => $purpose,
            'codeSent' => true,
        ]);
    }

    public function requestEmailCode(RequestEmailCodeRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->string('email')->toString())->first();
        $this->emailCodeService->issue($request->string('email')->toString(), $request->string('purpose')->toString(), $user);

        return ApiResponse::success([
            'email' => $request->string('email')->toString(),
            'purpose' => $request->string('purpose')->toString(),
            'codeSent' => true,
        ]);
    }

    public function verifyEmailCode(VerifyEmailCodeRequest $request): JsonResponse
    {
        $purpose = $request->string('purpose')->toString();
        $email = $request->string('email')->toString();

        $this->emailCodeService->consume($email, $purpose, $request->string('code')->toString());

        $user = User::query()->where('email', $email)->firstOrFail();

        if ($purpose === 'verify_email' && $user->email_verified_at === null) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        $token = $user->createToken($request->input('device_name', 'web'))->plainTextToken;
        $user->load('kycProfile');

        return ApiResponse::success([
            'token' => $token,
            'user' => AuthUserData::fromModel($user),
        ]);
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->string('email')->toString())->first();

        if ($user !== null) {
            $this->emailCodeService->issue($user->email, 'password_reset', $user);
        }

        return ApiResponse::success([
            'email' => $request->string('email')->toString(),
            'purpose' => 'password_reset',
            'codeSent' => true,
        ]);
    }

    public function resetPassword(ResetPasswordWithCodeRequest $request): JsonResponse
    {
        $email = $request->string('email')->toString();
        $this->emailCodeService->consume($email, 'password_reset', $request->string('code')->toString());

        $user = User::query()->where('email', $email)->firstOrFail();
        $user->forceFill(['password' => $request->string('password')->toString()])->save();

        return ApiResponse::success(['passwordReset' => true]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('kycProfile');

        return ApiResponse::success(AuthUserData::fromModel($user));
    }

    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user()->load('kycProfile');
        $request->user()?->currentAccessToken()?->delete();

        $token = $user->createToken($request->input('device_name', 'web'))->plainTextToken;

        return ApiResponse::success([
            'token' => $token,
            'user' => AuthUserData::fromModel($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return ApiResponse::success(['loggedOut' => true]);
    }
}
