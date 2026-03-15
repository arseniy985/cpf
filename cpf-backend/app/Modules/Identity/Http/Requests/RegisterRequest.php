<?php

namespace App\Modules\Identity\Http\Requests;

use App\Modules\Identity\Enums\RegistrationAccountType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:120', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:40'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'device_name' => ['nullable', 'string', 'max:100'],
            'account_type' => ['nullable', Rule::enum(RegistrationAccountType::class)],
        ];
    }
}
