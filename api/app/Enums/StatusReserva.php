<?php

namespace App\Enums;

enum StatusReserva: string
{
    case PendenteConfirmacao = 'pendente_confirmacao';
    case Confirmada = 'confirmada';
    case EmAndamento = 'em_andamento';
    case Concluida = 'concluida';
    case Cancelada = 'cancelada';

    public function rotulo(): string
    {
        return match ($this) {
            self::PendenteConfirmacao => 'Pendente de confirmação',
            self::Confirmada => 'Confirmada',
            self::EmAndamento => 'Em andamento',
            self::Concluida => 'Concluída',
            self::Cancelada => 'Cancelada',
        };
    }

    public function ocupaVaga(): bool
    {
        return in_array($this, [
            self::PendenteConfirmacao,
            self::Confirmada,
            self::EmAndamento,
        ], true);
    }

    /**
     * @return list<string>
     */
    public static function queOcupamVaga(): array
    {
        return array_values(array_map(
            fn (self $status) => $status->value,
            array_filter(self::cases(), fn (self $status) => $status->ocupaVaga()),
        ));
    }
}
