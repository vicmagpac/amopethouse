<?php

namespace App\Http\Resources\Api\V1;

use App\Models\TipoServico;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin TipoServico */
class TipoServicoResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'slug' => $this->slug?->value,
            'descricao' => $this->descricao,
            'preco' => $this->preco,
            'preco_turno_longo' => $this->preco_turno_longo,
            'duracao_minutos' => $this->duracao_minutos,
            'capacidade' => $this->capacidade,
            'exige_vacina' => $this->exige_vacina,
            'ativo' => $this->ativo,
        ];
    }
}
