<?php

namespace App\Modules\CRM\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:120'],
            'phone' => ['nullable', 'string', 'max:40'],
            'subject' => ['required', 'string', 'max:120'],
            'source' => ['nullable', 'string', 'max:60'],
            'message' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
