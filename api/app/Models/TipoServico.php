<?php

namespace App\Models;

use App\Enums\TipoServicoSlug;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'nome',
    'slug',
    'descricao',
    'preco',
    'preco_turno_longo',
    'duracao_minutos',
    'capacidade',
    'exige_vacina',
    'ativo',
])]
class TipoServico extends Model
{
    protected $table = 'tipos_servico';

    protected function casts(): array
    {
        return [
            'slug' => TipoServicoSlug::class,
            'preco' => 'decimal:2',
            'preco_turno_longo' => 'decimal:2',
            'exige_vacina' => 'boolean',
            'ativo' => 'boolean',
        ];
    }

    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }

    public function bloqueios(): HasMany
    {
        return $this->hasMany(BloqueioEquipe::class);
    }
}
