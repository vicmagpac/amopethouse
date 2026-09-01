<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Animal;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Animal */
class AnimalResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'especie' => $this->especie?->value,
            'especie_rotulo' => $this->especie?->rotulo(),
            'raca' => $this->raca,
            'porte' => $this->porte?->value,
            'porte_rotulo' => $this->porte?->rotulo(),
            'sexo' => $this->sexo?->value,
            'sexo_rotulo' => $this->sexo?->rotulo(),
            'data_nascimento' => $this->data_nascimento?->toDateString(),
            'peso' => $this->peso,
            'castrado' => $this->castrado,
            'temperamento' => $this->temperamento,
            'observacoes' => $this->observacoes,
            'foto_url' => $this->fotoUrl(),
            'vacinas' => RegistroVacinaResource::collection($this->whenLoaded('registrosVacinas')),
            'criado_em' => $this->created_at?->toIso8601String(),
        ];
    }
}
