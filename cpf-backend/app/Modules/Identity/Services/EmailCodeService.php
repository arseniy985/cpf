<?php

namespace App\Modules\Identity\Services;

use App\Models\User;
use App\Modules\Identity\Domain\Models\EmailAuthCode;
use App\Modules\Identity\Notifications\EmailCodeNotification;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class EmailCodeService
{
    public function issue(string $email, string $purpose, ?User $user = null): EmailAuthCode
    {
        EmailAuthCode::query()
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->delete();

        $plainCode = app()->environment('testing')
            ? '123456'
            : str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $code = EmailAuthCode::query()->create([
            'user_id' => $user?->id,
            'email' => $email,
            'purpose' => $purpose,
            'code_hash' => Hash::make($plainCode),
            'expires_at' => now()->addMinutes(10),
        ]);

        ($user ?? new User(['email' => $email]))->notify(new EmailCodeNotification($plainCode, $purpose));

        return $code;
    }

    public function consume(string $email, string $purpose, string $plainCode): EmailAuthCode
    {
        $code = EmailAuthCode::query()
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->latest()
            ->first();

        if (! $code || ! $code->canBeUsed()) {
            throw new UnprocessableEntityHttpException('Код недействителен или истек.');
        }

        $code->increment('attempts');

        if (! Hash::check($plainCode, $code->code_hash)) {
            throw new UnprocessableEntityHttpException('Неверный код подтверждения.');
        }

        $code->forceFill(['consumed_at' => now()])->save();

        return $code;
    }
}
