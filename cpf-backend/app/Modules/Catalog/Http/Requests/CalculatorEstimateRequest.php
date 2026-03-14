<?php

namespace App\Modules\Catalog\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalculatorEstimateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'exists:projects,id'],
            'amount' => ['required', 'integer', 'min:1000'],
            'term_months' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
