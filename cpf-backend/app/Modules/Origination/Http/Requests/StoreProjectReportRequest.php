<?php

namespace App\Modules\Origination\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:5000'],
            'file_url' => ['nullable', 'url'],
            'report_date' => ['required', 'date'],
            'is_public' => ['nullable', 'boolean'],
        ];
    }
}
