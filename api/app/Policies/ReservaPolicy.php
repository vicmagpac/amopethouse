<?php

namespace App\Policies;

use App\Models\Reserva;
use App\Models\Usuario;

class ReservaPolicy
{
    public function viewAny(Usuario $usuario): bool
    {
        return true;
    }

    public function view(Usuario $usuario, Reserva $reserva): bool
    {
        return $usuario->eAdministrador() || $reserva->usuario_id === $usuario->id;
    }

    public function create(Usuario $usuario): bool
    {
        return true;
    }

    public function cancel(Usuario $usuario, Reserva $reserva): bool
    {
        return $usuario->eAdministrador() || $reserva->usuario_id === $usuario->id;
    }

    public function gerenciar(Usuario $usuario, Reserva $reserva): bool
    {
        return $usuario->eAdministrador();
    }
}
