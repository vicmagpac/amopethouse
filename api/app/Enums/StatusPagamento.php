<?php

namespace App\Enums;

enum StatusPagamento: string
{
    case AReceber = 'a_receber';
    case Recebido = 'recebido';

    public function rotulo(): string
    {
        return match ($this) {
            self::AReceber => 'Pendente de pagamento',
            self::Recebido => 'Pago',
        };
    }
}
