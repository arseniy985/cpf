<?php

namespace App\Modules\Payments\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWithdrawalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'integer', 'min:1000'],
            'bank_name' => ['required', 'string', 'max:120'],
            'bank_account' => ['required', 'string', 'max:120'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
