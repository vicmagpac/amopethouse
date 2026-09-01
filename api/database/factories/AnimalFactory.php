<?php

namespace Database\Factories;

use App\Enums\EspecieAnimal;
use App\Enums\PorteAnimal;
use App\Enums\SexoAnimal;
use App\Models\Animal;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Animal>
 */
class AnimalFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'usuario_id' => Usuario::factory(),
            'nome' => fake()->firstName(),
            'especie' => fake()->randomElement(EspecieAnimal::cases()),
            'raca' => 'SRD',
            'porte' => fake()->randomElement(PorteAnimal::cases()),
            'sexo' => fake()->randomElement(SexoAnimal::cases()),
            'data_nascimento' => fake()->dateTimeBetween('-10 years', '-3 months'),
            'peso' => fake()->randomFloat(2, 1, 40),
            'castrado' => fake()->boolean(),
            'temperamento' => 'calmo',
            'observacoes' => null,
        ];
    }
}
