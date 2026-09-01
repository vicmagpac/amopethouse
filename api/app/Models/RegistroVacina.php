<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'animal_id',
    'nome',
    'aplicada_em',
    'expira_em',
    'documento_caminho',
])]
class RegistroVacina extends Model
{
    protected $table = 'registros_vacinas';

    protected function casts(): array
    {
        return [
            'aplicada_em' => 'date',
            'expira_em' => 'date',
        ];
    }

    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }

    public function documentoUrl(): ?string
    {
        if (! $this->documento_caminho) {
            return null;
        }

        return Storage::disk('public')->url($this->documento_caminho);
    }
}
