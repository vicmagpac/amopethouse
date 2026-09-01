<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class SalvarVacinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'],
            'aplicada_em' => ['required', 'date', 'before_or_equal:today'],
            'expira_em' => ['nullable', 'date', 'after_or_equal:aplicada_em'],
            'documento' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'nome' => 'vacina',
            'aplicada_em' => 'data de aplicação',
            'expira_em' => 'validade',
            'documento' => 'comprovante',
        ];
    }
}
