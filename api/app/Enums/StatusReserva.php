<?php

namespace App\Enums;

enum StatusReserva: string
{
    case Confirmada = 'confirmada';
    case EmAndamento = 'em_andamento';
    case Concluida = 'concluida';
    case Cancelada = 'cancelada';

    public function rotulo(): string
    {
        return match ($this) {
            self::Confirmada => 'Confirmada',
            self::EmAndamento => 'Em andamento',
            self::Concluida => 'Concluída',
            self::Cancelada => 'Cancelada',
        };
    }

    public function ocupaVaga(): bool
    {
        return in_array($this, [self::Confirmada, self::EmAndamento], true);
    }
}
