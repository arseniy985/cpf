<?php

namespace App\Modules\Origination\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOwnerProjectDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'kind' => ['required', 'string', 'max:60'],
            'label' => ['nullable', 'string', 'max:60'],
            'file_url' => ['nullable', 'url'],
            'is_public' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
        ];
    }
}
