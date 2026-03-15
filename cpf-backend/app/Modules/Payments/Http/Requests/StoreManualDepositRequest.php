<?php

namespace App\Modules\Payments\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreManualDepositRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'integer', 'min:1000'],
            'payer_name' => ['required', 'string', 'max:255'],
            'payer_bank' => ['nullable', 'string', 'max:255'],
            'payer_account_last4' => ['nullable', 'string', 'size:4', 'regex:/^[0-9]{4}$/'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
