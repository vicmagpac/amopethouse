<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class CadastrarUsuarioRequest extends FormRequest
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
            'email' => ['required', 'email', 'max:255', 'unique:usuarios,email'],
            'telefone' => ['required', 'string', 'max:20'],
            'cpf' => ['required', 'digits:11', 'unique:usuarios,cpf'],
            'senha' => ['required', 'confirmed', Password::min(8)],
            'rua' => ['nullable', 'string', 'max:255'],
            'numero' => ['nullable', 'string', 'max:20'],
            'complemento' => ['nullable', 'string', 'max:255'],
            'bairro' => ['nullable', 'string', 'max:255'],
            'cidade' => ['nullable', 'string', 'max:255'],
            'estado' => ['nullable', 'string', 'size:2'],
            'cep' => ['nullable', 'string', 'max:9'],
            'contato_emergencia_nome' => ['nullable', 'string', 'max:255'],
            'contato_emergencia_telefone' => ['nullable', 'string', 'max:20'],
            'lgpd_consentimento' => ['accepted'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'nome' => 'nome',
            'email' => 'e-mail',
            'telefone' => 'telefone',
            'cpf' => 'CPF',
            'senha' => 'senha',
            'lgpd_consentimento' => 'consentimento da LGPD',
        ];
    }

    protected function prepareForValidation(): void
    {
        $ajustes = [];

        foreach (['cpf', 'telefone', 'cep', 'contato_emergencia_telefone'] as $campo) {
            if ($this->exists($campo)) {
                $digitos = preg_replace('/\D+/', '', (string) $this->input($campo));
                $ajustes[$campo] = $digitos === '' ? null : $digitos;
            }
        }

        if ($this->filled('estado')) {
            $ajustes['estado'] = strtoupper((string) $this->input('estado'));
        } elseif ($this->exists('estado') && $this->input('estado') === '') {
            $ajustes['estado'] = null;
        }

        if ($ajustes !== []) {
            $this->merge($ajustes);
        }
    }
}
