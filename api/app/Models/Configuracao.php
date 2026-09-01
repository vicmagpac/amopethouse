<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['chave', 'valor'])]
class Configuracao extends Model
{
    public const CAPACIDADE_CASA = 'capacidade_casa';

    protected $table = 'configuracoes';

    public static function capacidadeCasa(): int
    {
        $valor = static::query()->where('chave', self::CAPACIDADE_CASA)->value('valor');

        return max(1, (int) ($valor ?: 3));
    }

    public static function definirCapacidadeCasa(int $valor): int
    {
        $capacidade = max(1, $valor);

        static::query()->updateOrCreate(
            ['chave' => self::CAPACIDADE_CASA],
            ['valor' => (string) $capacidade],
        );

        return $capacidade;
    }
}
