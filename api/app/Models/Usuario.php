<?php

namespace App\Models;

use App\Enums\PapelUsuario;
use Database\Factories\UsuarioFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'nome',
    'email',
    'telefone',
    'cpf',
    'papel',
    'senha',
    'rua',
    'numero',
    'complemento',
    'bairro',
    'cidade',
    'estado',
    'cep',
    'contato_emergencia_nome',
    'contato_emergencia_telefone',
    'lgpd_consentimento_em',
    'email_verificado_em',
])]
#[Hidden(['senha', 'remember_token'])]
class Usuario extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UsuarioFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';

    public function getAuthPasswordName(): string
    {
        return 'senha';
    }

    public function getNameAttribute(): string
    {
        return $this->attributes['nome'] ?? '';
    }

    public function hasVerifiedEmail(): bool
    {
        return ! is_null($this->email_verificado_em);
    }

    public function markEmailAsVerified(): bool
    {
        return $this->forceFill([
            'email_verificado_em' => $this->freshTimestamp(),
        ])->save();
    }

    protected function casts(): array
    {
        return [
            'email_verificado_em' => 'datetime',
            'lgpd_consentimento_em' => 'datetime',
            'senha' => 'hashed',
            'papel' => PapelUsuario::class,
        ];
    }

    public function animais(): HasMany
    {
        return $this->hasMany(Animal::class);
    }

    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }

    public function eAdministrador(): bool
    {
        return $this->papel === PapelUsuario::Administrador;
    }
}
