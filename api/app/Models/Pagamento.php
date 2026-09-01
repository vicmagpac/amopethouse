<?php

namespace App\Models;

use App\Enums\MeioPagamento;
use App\Enums\StatusPagamento;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'reserva_id',
    'status',
    'meio',
    'valor',
    'recebido_em',
])]
class Pagamento extends Model
{
    protected $table = 'pagamentos';

    protected function casts(): array
    {
        return [
            'status' => StatusPagamento::class,
            'meio' => MeioPagamento::class,
            'valor' => 'decimal:2',
            'recebido_em' => 'datetime',
        ];
    }

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class);
    }
}
