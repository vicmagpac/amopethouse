<?php

namespace Tests\Feature;

use App\Enums\PapelUsuario;
use App\Enums\StatusReserva;
use App\Enums\TipoTurno;
use App\Models\Configuracao;
use App\Models\TipoServico;
use App\Models\Usuario;
use Carbon\Carbon;
use Database\Seeders\TipoServicoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DisponibilidadeCasaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TipoServicoSeeder::class);
        $this->travelTo(Carbon::parse('2026-08-20 09:00:00'));
    }

    public function test_dois_animais_na_hospedagem_deixam_uma_vaga_na_creche(): void
    {
        $this->ocuparHospedagem(2, '2026-09-01', '2026-09-02');

        $resposta = $this->getJson('/api/v1/disponibilidade?'.http_build_query([
            'tipo_servico_id' => $this->tipo('creche')->id,
            'de' => '2026-09-01',
            'ate' => '2026-09-01',
        ]))->assertOk();

        $turnos = $resposta->json('data.dias.0.turnos');
        $this->assertSame(1, $turnos[0]['vagas']);
        $this->assertTrue($turnos[0]['disponivel']);
    }

    public function test_casa_cheia_bloqueia_creche_e_nao_afeta_passeio(): void
    {
        $this->ocuparHospedagem(3, '2026-09-01', '2026-09-02');

        $creche = $this->getJson('/api/v1/disponibilidade?'.http_build_query([
            'tipo_servico_id' => $this->tipo('creche')->id,
            'de' => '2026-09-01',
            'ate' => '2026-09-01',
        ]))->assertOk();

        $this->assertSame(0, $creche->json('data.dias.0.turnos.0.vagas'));
        $this->assertFalse($creche->json('data.dias.0.turnos.0.disponivel'));

        $passeio = $this->getJson('/api/v1/disponibilidade?'.http_build_query([
            'tipo_servico_id' => $this->tipo('passeio')->id,
            'de' => '2026-09-01',
            'ate' => '2026-09-01',
        ]))->assertOk();

        $this->assertNotEmpty($passeio->json('data.dias.0.horarios'));
    }

    public function test_pedido_pendente_tambem_ocupa_vaga_da_casa(): void
    {
        $this->ocuparHospedagem(3, '2026-09-01', '2026-09-02', StatusReserva::PendenteConfirmacao);

        $creche = $this->getJson('/api/v1/disponibilidade?'.http_build_query([
            'tipo_servico_id' => $this->tipo('creche')->id,
            'de' => '2026-09-01',
            'ate' => '2026-09-01',
        ]))->assertOk();

        $this->assertSame(0, $creche->json('data.dias.0.turnos.0.vagas'));
    }

    public function test_tutor_nao_agenda_creche_alem_da_vaga_da_casa(): void
    {
        $this->ocuparHospedagem(2, '2026-09-01', '2026-09-02');

        $tutor = Usuario::factory()->create();
        $primeiro = $this->animalComVacina($tutor, 'Luna');
        $segundo = $this->animalComVacina($tutor, 'Nino');
        Sanctum::actingAs($tutor);

        $this->postJson('/api/v1/reservas', [
            'tipo_servico_id' => $this->tipo('creche')->id,
            'animais' => [$primeiro->id, $segundo->id],
            'data_inicio' => '2026-09-01',
            'turno' => TipoTurno::QuatroHoras->value,
        ])->assertUnprocessable();

        $this->postJson('/api/v1/reservas', [
            'tipo_servico_id' => $this->tipo('creche')->id,
            'animais' => [$primeiro->id],
            'data_inicio' => '2026-09-01',
            'turno' => TipoTurno::QuatroHoras->value,
        ])->assertCreated();
    }

    public function test_admin_aumenta_capacidade_da_casa(): void
    {
        $this->ocuparHospedagem(3, '2026-09-01', '2026-09-02');
        Configuracao::definirCapacidadeCasa(4);

        $resposta = $this->getJson('/api/v1/disponibilidade?'.http_build_query([
            'tipo_servico_id' => $this->tipo('creche')->id,
            'de' => '2026-09-01',
            'ate' => '2026-09-01',
        ]))->assertOk();

        $this->assertSame(1, $resposta->json('data.dias.0.turnos.0.vagas'));

        $admin = Usuario::factory()->create(['papel' => PapelUsuario::Administrador]);
        Sanctum::actingAs($admin);
        $this->putJson('/api/v1/admin/configuracao', ['capacidade_casa' => 5])
            ->assertOk()
            ->assertJsonPath('data.capacidade_casa', 5);
        $this->assertSame(5, Configuracao::capacidadeCasa());
    }

    private function ocuparHospedagem(
        int $quantidade,
        string $entrada,
        string $saida,
        StatusReserva $status = StatusReserva::Confirmada,
    ): void {
        $tutor = Usuario::factory()->create();
        $ids = [];
        for ($indice = 0; $indice < $quantidade; $indice++) {
            $ids[] = $this->animalComVacina($tutor, "Pet {$indice}")->id;
        }

        $reserva = $tutor->reservas()->create([
            'tipo_servico_id' => $this->tipo('hospedagem')->id,
            'status' => $status,
            'inicio' => Carbon::parse($entrada)->setTime(10, 0),
            'fim' => Carbon::parse($saida)->setTime(10, 0),
            'valor_total' => 120 * $quantidade,
        ]);
        $reserva->animais()->sync($ids);
    }

    private function animalComVacina(Usuario $tutor, string $nome)
    {
        $animal = $tutor->animais()->create([
            'nome' => $nome,
            'especie' => 'cao',
            'porte' => 'pequeno',
            'sexo' => 'macho',
        ]);
        $animal->registrosVacinas()->create([
            'nome' => 'Antirrábica',
            'aplicada_em' => now()->subMonth()->toDateString(),
            'expira_em' => now()->addYear()->toDateString(),
        ]);

        return $animal;
    }

    private function tipo(string $slug): TipoServico
    {
        return TipoServico::query()->where('slug', $slug)->firstOrFail();
    }
}
