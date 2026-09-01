<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Reserva */
class ReservaResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status?->value,
            'status_rotulo' => $this->status?->rotulo(),
            'inicio' => $this->inicio?->timezone(config('app.timezone'))->toIso8601String(),
            'fim' => $this->fim?->timezone(config('app.timezone'))->toIso8601String(),
            'valor_total' => $this->valor_total,
            'turno' => $this->turno?->value,
            'turno_rotulo' => $this->turno?->rotulo(),
            'endereco' => $this->endereco,
            'origem' => $this->origem,
            'destino' => $this->destino,
            'local_compromisso' => $this->local_compromisso,
            'observacoes' => $this->observacoes,
            'tipo_servico' => new TipoServicoResource($this->whenLoaded('tipoServico')),
            'animais' => AnimalResource::collection($this->whenLoaded('animais')),
            'tutor' => new UsuarioResource($this->whenLoaded('usuario')),
            'pagamento' => $this->whenLoaded('pagamento', fn () => [
                'status' => $this->pagamento?->status?->value,
                'status_rotulo' => $this->pagamento?->status?->rotulo(),
                'meio' => $this->pagamento?->meio?->value,
                'meio_rotulo' => $this->pagamento?->meio?->rotulo(),
                'valor' => $this->pagamento?->valor,
                'recebido_em' => $this->pagamento?->recebido_em?->toIso8601String(),
            ]),
            'criado_em' => $this->created_at?->toIso8601String(),
        ];
    }
}
