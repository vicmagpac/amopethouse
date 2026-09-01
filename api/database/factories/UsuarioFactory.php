<?php

namespace Database\Factories;

use App\Enums\PapelUsuario;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<Usuario>
 */
class UsuarioFactory extends Factory
{
    protected static ?string $senha;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nome' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'telefone' => '85992030506',
            'cpf' => fake()->unique()->numerify('###########'),
            'papel' => PapelUsuario::Tutor,
            'email_verificado_em' => now(),
            'senha' => static::$senha ??= Hash::make('password'),
            'lgpd_consentimento_em' => now(),
            'remember_token' => Str::random(10),
        ];
    }

    public function naoVerificado(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verificado_em' => null,
        ]);
    }
}
