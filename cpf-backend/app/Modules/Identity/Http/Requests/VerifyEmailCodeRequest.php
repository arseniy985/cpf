<?php

namespace App\Modules\Identity\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyEmailCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
            'purpose' => ['required', 'string', 'in:verify_email,login,password_reset'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ];
    }
}
