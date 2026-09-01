<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'tipo_servico_id',
    'inicio',
    'fim',
    'motivo',
])]
class BloqueioEquipe extends Model
{
    protected $table = 'bloqueios_equipe';

    protected function casts(): array
    {
        return [
            'inicio' => 'datetime',
            'fim' => 'datetime',
        ];
    }

    public function tipoServico(): BelongsTo
    {
        return $this->belongsTo(TipoServico::class);
    }
}
