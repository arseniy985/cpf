<?php

namespace App\Modules\Origination\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOwnerOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'legal_name' => ['required', 'string', 'max:255'],
            'brand_name' => ['nullable', 'string', 'max:255'],
            'entity_type' => ['required', 'string', 'max:40'],
            'registration_number' => ['required', 'string', 'max:64'],
            'tax_id' => ['required', 'string', 'max:32'],
            'website_url' => ['nullable', 'url'],
            'address' => ['required', 'string', 'max:255'],
            'signatory_name' => ['required', 'string', 'max:255'],
            'signatory_role' => ['nullable', 'string', 'max:255'],
            'beneficiary_name' => ['nullable', 'string', 'max:255'],
            'overview' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
