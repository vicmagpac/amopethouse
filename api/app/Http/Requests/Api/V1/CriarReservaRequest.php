<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\TipoTurno;
use App\Models\TipoServico;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class CriarReservaRequest extends FormRequest
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
            'tipo_servico_id' => ['required', 'integer', 'exists:tipos_servico,id'],
            'animais' => ['required', 'array', 'min:1'],
            'animais.*' => ['integer', 'distinct', 'exists:animais,id'],
            'data_inicio' => ['required', 'date'],
            'data_fim' => ['nullable', 'date'],
            'turno' => ['nullable', Rule::enum(TipoTurno::class)],
            'horario' => ['nullable', 'date_format:H:i'],
            'endereco' => ['nullable', 'string', 'max:255'],
            'origem' => ['nullable', 'string', 'max:255'],
            'destino' => ['nullable', 'string', 'max:255'],
            'local_compromisso' => ['nullable', 'string', 'max:255'],
            'observacoes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $tipo = TipoServico::query()->find($this->integer('tipo_servico_id'));
            if (! $tipo || ! $tipo->ativo) {
                $validator->errors()->add('tipo_servico_id', 'Este serviço não está disponível.');

                return;
            }

            if ($tipo->slug->ePorNoite() && ! $this->filled('data_fim')) {
                $validator->errors()->add('data_fim', 'Informe a data de saída.');
            }

            if ($tipo->slug->ePorTurno() && ! $this->filled('turno')) {
                $validator->errors()->add('turno', 'Escolha o turno da creche.');
            }

            if ($tipo->slug->ePorHorario() && ! $this->filled('horario')) {
                $validator->errors()->add('horario', 'Escolha um horário.');
            }

            if ($tipo->slug->value === 'cuidador' && ! $this->filled('endereco')) {
                $validator->errors()->add('endereco', 'Informe o endereço da visita.');
            }

            if ($tipo->slug->value === 'transporte') {
                if (! $this->filled('origem')) {
                    $validator->errors()->add('origem', 'Informe a origem.');
                }
                if (! $this->filled('destino')) {
                    $validator->errors()->add('destino', 'Informe o destino.');
                }
            }

            if ($tipo->slug->value === 'acompanhamento' && ! $this->filled('local_compromisso')) {
                $validator->errors()->add('local_compromisso', 'Informe o local do compromisso.');
            }
        });
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'tipo_servico_id' => 'serviço',
            'animais' => 'animais',
            'data_inicio' => 'data',
            'data_fim' => 'data de saída',
            'turno' => 'turno',
            'horario' => 'horário',
        ];
    }
}
