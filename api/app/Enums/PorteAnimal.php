<?php

namespace App\Enums;

enum PorteAnimal: string
{
    case Pequeno = 'pequeno';
    case Medio = 'medio';
    case Grande = 'grande';

    public function rotulo(): string
    {
        return match ($this) {
            self::Pequeno => 'Pequeno',
            self::Medio => 'Médio',
            self::Grande => 'Grande',
        };
    }
}
