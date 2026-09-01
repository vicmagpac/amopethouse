<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class AtualizarTipoServicoRequest extends FormRequest
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
            'nome' => ['sometimes', 'string', 'max:255'],
            'descricao' => ['nullable', 'string'],
            'preco' => ['sometimes', 'numeric', 'min:0'],
            'preco_turno_longo' => ['nullable', 'numeric', 'min:0'],
            'duracao_minutos' => ['sometimes', 'integer', 'min:15'],
            'capacidade' => ['sometimes', 'integer', 'min:1'],
            'exige_vacina' => ['sometimes', 'boolean'],
            'ativo' => ['sometimes', 'boolean'],
        ];
    }
}
