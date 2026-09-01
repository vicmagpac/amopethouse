<?php

namespace Tests\Feature;

use App\Enums\PapelUsuario;
use App\Enums\StatusPagamento;
use App\Enums\StatusReserva;
use App\Models\Usuario;
use Database\Seeders\TipoServicoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReservaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TipoServicoSeeder::class);
    }

    public function test_tutor_confirma_hospedagem_com_pagamento_a_receber(): void
    {
        $tutor = Usuario::factory()->create();
        $animal = $tutor->animais()->create([
            'nome' => 'Luna',
            'especie' => 'cao',
            'porte' => 'pequeno',
            'sexo' => 'femea',
        ]);
        $animal->registrosVacinas()->create([
            'nome' => 'Antirrábica',
            'aplicada_em' => now()->subMonth()->toDateString(),
            'expira_em' => now()->addYear()->toDateString(),
        ]);

        $tipo = $this->tipo('hospedagem');
        Sanctum::actingAs($tutor);

        $entrada = now()->addDays(3)->toDateString();
        $saida = now()->addDays(5)->toDateString();

        $this->postJson('/api/v1/reservas', [
            'tipo_servico_id' => $tipo->id,
            'animais' => [$animal->id],
            'data_inicio' => $entrada,
            'data_fim' => $saida,
        ])
            ->assertCreated()
            ->assertJsonPath('data.status', StatusReserva::Confirmada->value)
            ->assertJsonPath('data.pagamento.status', StatusPagamento::AReceber->value)
            ->assertJsonPath('data.pagamento.meio', 'no_local');

        $this->assertDatabaseHas('reservas', [
            'usuario_id' => $tutor->id,
            'tipo_servico_id' => $tipo->id,
            'status' => StatusReserva::Confirmada->value,
        ]);
    }

    public function test_tutor_confirma_hospedagem_com_entrada_hoje(): void
    {
        $this->travelTo(now()->setTime(15, 30));

        $tutor = Usuario::factory()->create();
        $animal = $tutor->animais()->create([
            'nome' => 'Nino',
            'especie' => 'gato',
            'porte' => 'pequeno',
            'sexo' => 'macho',
        ]);
        $animal->registrosVacinas()->create([
            'nome' => 'Antirrábica',
            'aplicada_em' => now()->subMonth()->toDateString(),
            'expira_em' => now()->addYear()->toDateString(),
        ]);

        Sanctum::actingAs($tutor);

        $this->postJson('/api/v1/reservas', [
            'tipo_servico_id' => $this->tipo('hospedagem')->id,
            'animais' => [$animal->id],
            'data_inicio' => now()->toDateString(),
            'data_fim' => now()->addDays(3)->toDateString(),
        ])
            ->assertCreated()
            ->assertJsonPath('data.status', StatusReserva::Confirmada->value);
    }

    public function test_hospedagem_sem_vacina_e_recusada(): void
    {
        $tutor = Usuario::factory()->create();
        $animal = $tutor->animais()->create([
            'nome' => 'Thor',
            'especie' => 'cao',
            'porte' => 'medio',
            'sexo' => 'macho',
        ]);

        Sanctum::actingAs($tutor);

        $this->postJson('/api/v1/reservas', [
            'tipo_servico_id' => $this->tipo('hospedagem')->id,
            'animais' => [$animal->id],
            'data_inicio' => now()->addDays(3)->toDateString(),
            'data_fim' => now()->addDays(4)->toDateString(),
        ])->assertUnprocessable();
    }

    public function test_tutor_lista_apenas_as_proprias_reservas(): void
    {
        $tutor = Usuario::factory()->create();
        $outro = Usuario::factory()->create();
        $tipo = $this->tipo('passeio');

        $tutor->reservas()->create([
            'tipo_servico_id' => $tipo->id,
            'status' => StatusReserva::Confirmada,
            'inicio' => now()->addDay()->setTime(9, 0),
            'fim' => now()->addDay()->setTime(10, 0),
            'valor_total' => 50,
        ]);
        $outro->reservas()->create([
            'tipo_servico_id' => $tipo->id,
            'status' => StatusReserva::Confirmada,
            'inicio' => now()->addDays(2)->setTime(9, 0),
            'fim' => now()->addDays(2)->setTime(10, 0),
            'valor_total' => 50,
        ]);

        Sanctum::actingAs($tutor);
        $this->getJson('/api/v1/reservas')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_marca_pagamento_recebido(): void
    {
        $admin = Usuario::factory()->create(['papel' => PapelUsuario::Administrador]);
        $tutor = Usuario::factory()->create();
        $tipo = $this->tipo('passeio');
        $reserva = $tutor->reservas()->create([
            'tipo_servico_id' => $tipo->id,
            'status' => StatusReserva::Confirmada,
            'inicio' => now()->addDay()->setTime(9, 0),
            'fim' => now()->addDay()->setTime(10, 0),
            'valor_total' => 50,
        ]);
        $reserva->pagamento()->create([
            'status' => StatusPagamento::AReceber,
            'meio' => 'no_local',
            'valor' => 50,
        ]);

        Sanctum::actingAs($admin);
        $this->postJson("/api/v1/admin/reservas/{$reserva->id}/pagamento")
            ->assertOk()
            ->assertJsonPath('data.pagamento.status', StatusPagamento::Recebido->value);
    }

    public function test_tutor_nao_acessa_painel_admin(): void
    {
        Sanctum::actingAs(Usuario::factory()->create());
        $this->getJson('/api/v1/admin/reservas')->assertForbidden();
    }

    private function tipo(string $slug): \App\Models\TipoServico
    {
        return \App\Models\TipoServico::query()->where('slug', $slug)->firstOrFail();
    }
}
