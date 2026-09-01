<?php

namespace Database\Seeders;

use App\Enums\PapelUsuario;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class UsuarioAdminSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::query()->updateOrCreate(
            ['email' => 'admin@amopethouse.com.br'],
            [
                'nome' => 'Equipe Amo Pet House',
                'telefone' => '85992030506',
                'cpf' => '00000000000',
                'papel' => PapelUsuario::Administrador,
                'senha' => 'AdminAmo@2026',
                'email_verificado_em' => now(),
                'lgpd_consentimento_em' => now(),
            ],
        );
    }
}
