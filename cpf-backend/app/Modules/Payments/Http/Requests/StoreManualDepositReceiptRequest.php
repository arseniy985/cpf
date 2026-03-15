<?php

namespace App\Modules\Payments\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreManualDepositReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:10240'],
        ];
    }
}
