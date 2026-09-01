<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CadastroTest extends TestCase
{
    use RefreshDatabase;

    public function test_tutor_consegue_cadastrar_e_entrar(): void
    {
        $resposta = $this->postJson('/api/v1/cadastrar', [
            'nome' => 'Maria Tutor',
            'email' => 'maria@amopethouse.com.br',
            'telefone' => '85992030506',
            'cpf' => '12345678901',
            'senha' => 'senha-segura',
            'senha_confirmation' => 'senha-segura',
            'lgpd_consentimento' => true,
        ]);

        $resposta->assertCreated()
            ->assertJsonPath('data.nome', 'Maria Tutor')
            ->assertJsonStructure(['token', 'data' => ['id', 'email']]);

        $this->assertDatabaseHas('usuarios', [
            'email' => 'maria@amopethouse.com.br',
        ]);

        $this->postJson('/api/v1/entrar', [
            'email' => 'maria@amopethouse.com.br',
            'senha' => 'senha-segura',
        ])->assertOk()->assertJsonStructure(['token']);
    }

    public function test_tutor_lista_apenas_os_proprios_animais(): void
    {
        $tutor = Usuario::factory()->create();
        $outro = Usuario::factory()->create();

        $tutor->animais()->create([
            'nome' => 'Luna',
            'especie' => 'cao',
            'porte' => 'pequeno',
            'sexo' => 'femea',
        ]);

        $outro->animais()->create([
            'nome' => 'Mingau',
            'especie' => 'gato',
            'porte' => 'pequeno',
            'sexo' => 'macho',
        ]);

        Sanctum::actingAs($tutor);
        $this->getJson('/api/v1/animais')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nome', 'Luna');
    }
}
