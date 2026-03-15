<?php

namespace App\Modules\Payments\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertInvestorPayoutProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'provider' => ['required', Rule::in(['yookassa'])],
            'payout_method_label' => ['nullable', 'string', 'max:160'],
            'payout_token' => ['nullable', 'string', 'max:4096'],
        ];
    }
}
