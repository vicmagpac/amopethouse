<?php

namespace App\Enums;

enum MeioPagamento: string
{
    case NoLocal = 'no_local';

    public function rotulo(): string
    {
        return 'Checkout presencial';
    }
}
