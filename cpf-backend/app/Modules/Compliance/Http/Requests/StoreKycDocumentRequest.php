<?php

namespace App\Modules\Compliance\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKycDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kind' => ['required', 'string', 'in:passport,tax_id,address_proof,company_docs,other'],
            'file' => ['required', 'file', 'max:10240'],
        ];
    }
}
