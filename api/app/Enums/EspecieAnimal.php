<?php

namespace App\Enums;

enum EspecieAnimal: string
{
    case Cao = 'cao';
    case Gato = 'gato';

    public function rotulo(): string
    {
        return match ($this) {
            self::Cao => 'Cão',
            self::Gato => 'Gato',
        };
    }
}
