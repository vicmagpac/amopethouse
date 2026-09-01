<?php

namespace App\Enums;

enum TipoTurno: string
{
    case QuatroHoras = 'quatro_horas';
    case OitoHoras = 'oito_horas';

    public function rotulo(): string
    {
        return match ($this) {
            self::QuatroHoras => '4 horas (8h às 12h)',
            self::OitoHoras => '8 horas (8h às 16h)',
        };
    }
}
