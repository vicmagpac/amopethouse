<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\EspecieAnimal;
use App\Enums\PorteAnimal;
use App\Enums\SexoAnimal;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SalvarAnimalRequest extends FormRequest
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
            'especie' => ['required', Rule::enum(EspecieAnimal::class)],
            'raca' => ['nullable', 'string', 'max:255'],
            'porte' => ['required', Rule::enum(PorteAnimal::class)],
            'sexo' => ['required', Rule::enum(SexoAnimal::class)],
            'data_nascimento' => ['nullable', 'date', 'before:today'],
            'peso' => ['nullable', 'numeric', 'min:0', 'max:120'],
            'castrado' => ['sometimes', 'boolean'],
            'temperamento' => ['nullable', 'string', 'max:255'],
            'observacoes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'nome' => 'nome',
            'especie' => 'espécie',
            'raca' => 'raça',
            'porte' => 'porte',
            'sexo' => 'sexo',
            'data_nascimento' => 'data de nascimento',
            'peso' => 'peso',
            'castrado' => 'castrado',
            'temperamento' => 'temperamento',
            'observacoes' => 'observações',
        ];
    }
}
