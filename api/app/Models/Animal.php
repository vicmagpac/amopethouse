<?php

namespace App\Models;

use App\Enums\EspecieAnimal;
use App\Enums\PorteAnimal;
use App\Enums\SexoAnimal;
use Database\Factories\AnimalFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'usuario_id',
    'nome',
    'especie',
    'raca',
    'porte',
    'sexo',
    'data_nascimento',
    'peso',
    'castrado',
    'temperamento',
    'observacoes',
    'foto_caminho',
])]
class Animal extends Model
{
    /** @use HasFactory<AnimalFactory> */
    use HasFactory;

    protected $table = 'animais';

    protected function casts(): array
    {
        return [
            'especie' => EspecieAnimal::class,
            'porte' => PorteAnimal::class,
            'sexo' => SexoAnimal::class,
            'data_nascimento' => 'date',
            'peso' => 'decimal:2',
            'castrado' => 'boolean',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    public function registrosVacinas(): HasMany
    {
        return $this->hasMany(RegistroVacina::class);
    }

    public function fotoUrl(): ?string
    {
        if (! $this->foto_caminho) {
            return null;
        }

        return Storage::disk('public')->url($this->foto_caminho);
    }
}
