<?php

namespace App\Modules\Investing\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvestmentApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'exists:projects,id'],
            'amount' => ['required', 'integer', 'min:10000'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
