<?php

namespace App\Enums;

enum SexoAnimal: string
{
    case Macho = 'macho';
    case Femea = 'femea';

    public function rotulo(): string
    {
        return match ($this) {
            self::Macho => 'Macho',
            self::Femea => 'Fêmea',
        };
    }
}
