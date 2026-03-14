<?php

namespace App\Modules\Identity\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:40'],
            'notification_preferences' => ['nullable', 'array'],
            'notification_preferences.email' => ['nullable', 'boolean'],
            'notification_preferences.sms' => ['nullable', 'boolean'],
            'notification_preferences.marketing' => ['nullable', 'boolean'],
        ];
    }
}
