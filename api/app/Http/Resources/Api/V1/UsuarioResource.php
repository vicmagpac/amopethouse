<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Usuario */
class UsuarioResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'email' => $this->email,
            'telefone' => $this->telefone,
            'cpf' => $this->cpf,
            'papel' => $this->papel?->value,
            'email_verificado' => $this->hasVerifiedEmail(),
            'rua' => $this->rua,
            'numero' => $this->numero,
            'complemento' => $this->complemento,
            'bairro' => $this->bairro,
            'cidade' => $this->cidade,
            'estado' => $this->estado,
            'cep' => $this->cep,
            'contato_emergencia_nome' => $this->contato_emergencia_nome,
            'contato_emergencia_telefone' => $this->contato_emergencia_telefone,
            'criado_em' => $this->created_at?->toIso8601String(),
        ];
    }
}
