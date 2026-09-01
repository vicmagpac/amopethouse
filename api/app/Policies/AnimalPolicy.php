<?php

namespace App\Policies;

use App\Models\Animal;
use App\Models\Usuario;

class AnimalPolicy
{
    public function viewAny(Usuario $usuario): bool
    {
        return true;
    }

    public function view(Usuario $usuario, Animal $animal): bool
    {
        return $animal->usuario_id === $usuario->id;
    }

    public function create(Usuario $usuario): bool
    {
        return true;
    }

    public function update(Usuario $usuario, Animal $animal): bool
    {
        return $animal->usuario_id === $usuario->id;
    }

    public function delete(Usuario $usuario, Animal $animal): bool
    {
        return $animal->usuario_id === $usuario->id;
    }
}
