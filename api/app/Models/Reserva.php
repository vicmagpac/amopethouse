<?php

namespace App\Models;

use App\Enums\StatusReserva;
use App\Enums\TipoTurno;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'usuario_id',
    'tipo_servico_id',
    'status',
    'inicio',
    'fim',
    'valor_total',
    'turno',
    'endereco',
    'origem',
    'destino',
    'local_compromisso',
    'observacoes',
])]
class Reserva extends Model
{
    protected $table = 'reservas';

    protected function casts(): array
    {
        return [
            'status' => StatusReserva::class,
            'turno' => TipoTurno::class,
            'inicio' => 'datetime',
            'fim' => 'datetime',
            'valor_total' => 'decimal:2',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    public function tipoServico(): BelongsTo
    {
        return $this->belongsTo(TipoServico::class);
    }

    public function animais(): BelongsToMany
    {
        return $this->belongsToMany(Animal::class, 'reserva_animais')->withTimestamps();
    }

    public function pagamento(): HasOne
    {
        return $this->hasOne(Pagamento::class);
    }
}
