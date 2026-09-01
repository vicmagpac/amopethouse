<?php

namespace App\Enums;

enum TipoServicoSlug: string
{
    case Hospedagem = 'hospedagem';
    case Creche = 'creche';
    case Cuidador = 'cuidador';
    case Passeio = 'passeio';
    case Transporte = 'transporte';
    case Acompanhamento = 'acompanhamento';

    public function ePorNoite(): bool
    {
        return $this === self::Hospedagem;
    }

    public function ePorTurno(): bool
    {
        return $this === self::Creche;
    }

    public function ePorHorario(): bool
    {
        return ! $this->ePorNoite() && ! $this->ePorTurno();
    }
}
