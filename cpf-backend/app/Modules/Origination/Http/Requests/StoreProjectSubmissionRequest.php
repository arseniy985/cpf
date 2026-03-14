<?php

namespace App\Modules\Origination\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectSubmissionRequest extends FormRequest
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
            'company_name' => ['nullable', 'string', 'max:120'],
            'project_name' => ['required', 'string', 'max:160'],
            'asset_type' => ['required', 'string', 'max:80'],
            'target_amount' => ['required', 'integer', 'min:100000'],
            'message' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
