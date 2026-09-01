<?php

namespace App\Http\Resources\Api\V1;

use App\Models\RegistroVacina;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RegistroVacina */
class RegistroVacinaResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'aplicada_em' => $this->aplicada_em?->toDateString(),
            'expira_em' => $this->expira_em?->toDateString(),
            'documento_url' => $this->documentoUrl(),
        ];
    }
}
