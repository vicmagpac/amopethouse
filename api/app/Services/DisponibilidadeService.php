<?php

namespace App\Services;

use App\Enums\StatusReserva;
use App\Enums\TipoServicoSlug;
use App\Enums\TipoTurno;
use App\Models\BloqueioEquipe;
use App\Models\Configuracao;
use App\Models\Reserva;
use App\Models\TipoServico;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class DisponibilidadeService
{
    /**
     * @return list<array<string, mixed>>
     */
    public function consultar(TipoServico $tipo, CarbonInterface $de, CarbonInterface $ate): array
    {
        $dias = [];
        $cursor = Carbon::parse($de)->startOfDay();
        $limite = Carbon::parse($ate)->startOfDay();

        while ($cursor->lte($limite)) {
            $dias[] = $this->dia($tipo, $cursor->copy());
            $cursor->addDay();
        }

        return $dias;
    }

    /**
     * @return array<string, mixed>
     */
    public function dia(TipoServico $tipo, Carbon $dia): array
    {
        if ($tipo->slug->ePorNoite()) {
            $inicio = $dia->copy()->setTime(10, 0);
            $fim = $inicio->copy()->addDay();
            $vagas = $this->vagasLivres($tipo, $inicio, $fim);
            $bloqueado = $this->estaBloqueado($tipo, $inicio, $fim);

            return [
                'data' => $dia->toDateString(),
                'disponivel' => ! $bloqueado && $vagas > 0 && $inicio->gte(now()->startOfDay()),
                'vagas' => max(0, $vagas),
            ];
        }

        if ($tipo->slug->ePorTurno()) {
            $turnos = [];
            foreach (TipoTurno::cases() as $turno) {
                [$inicio, $fim] = $this->janelaTurno($dia, $turno);
                $vagas = $this->vagasLivres($tipo, $inicio, $fim);
                $bloqueado = $this->estaBloqueado($tipo, $inicio, $fim);
                $turnos[] = [
                    'turno' => $turno->value,
                    'rotulo' => $turno->rotulo(),
                    'vagas' => max(0, $vagas),
                    'disponivel' => ! $bloqueado && $vagas > 0 && $inicio->gte(now()),
                ];
            }

            return [
                'data' => $dia->toDateString(),
                'disponivel' => collect($turnos)->contains(fn (array $item) => $item['disponivel']),
                'turnos' => $turnos,
            ];
        }

        $horarios = [];
        $duracao = max(30, (int) $tipo->duracao_minutos);
        for ($hora = 8; $hora <= 17; $hora++) {
            $inicio = $dia->copy()->setTime($hora, 0);
            $fim = $inicio->copy()->addMinutes($duracao);
            if ($fim->gt($dia->copy()->setTime(18, 0))) {
                continue;
            }
            if ($inicio->lt(now())) {
                continue;
            }
            if ($this->estaBloqueado($tipo, $inicio, $fim)) {
                continue;
            }
            if ($this->vagasLivres($tipo, $inicio, $fim) > 0) {
                $horarios[] = $inicio->format('H:i');
            }
        }

        return [
            'data' => $dia->toDateString(),
            'disponivel' => $horarios !== [],
            'horarios' => $horarios,
        ];
    }

    public function vagasLivres(TipoServico $tipo, CarbonInterface $inicio, CarbonInterface $fim): int
    {
        $vagasServico = (int) $tipo->capacidade - $this->ocupacao($inicio, $fim, [(int) $tipo->id]);

        if (! $tipo->slug?->ocupaACasa()) {
            return max(0, $vagasServico);
        }

        $vagasCasa = Configuracao::capacidadeCasa() - $this->ocupacaoCasa($inicio, $fim);

        return max(0, min($vagasServico, $vagasCasa));
    }

    public function ocupacaoCasa(CarbonInterface $inicio, CarbonInterface $fim): int
    {
        return $this->ocupacao($inicio, $fim, $this->idsServicosNaCasa());
    }

    public function cabe(TipoServico $tipo, CarbonInterface $inicio, CarbonInterface $fim, int $quantidade): bool
    {
        if ($this->estaBloqueado($tipo, $inicio, $fim)) {
            return false;
        }

        return $this->vagasLivres($tipo, $inicio, $fim) >= $quantidade;
    }

    /**
     * @return array{0: Carbon, 1: Carbon}
     */
    public function janelaTurno(CarbonInterface $dia, TipoTurno $turno): array
    {
        $base = Carbon::parse($dia)->startOfDay();

        return match ($turno) {
            TipoTurno::QuatroHoras => [$base->copy()->setTime(8, 0), $base->copy()->setTime(12, 0)],
            TipoTurno::OitoHoras => [$base->copy()->setTime(8, 0), $base->copy()->setTime(16, 0)],
        };
    }

    public function estaBloqueado(TipoServico $tipo, CarbonInterface $inicio, CarbonInterface $fim): bool
    {
        return BloqueioEquipe::query()
            ->where(function ($consulta) use ($tipo): void {
                $consulta->whereNull('tipo_servico_id')
                    ->orWhere('tipo_servico_id', $tipo->id);
            })
            ->where('inicio', '<', $fim)
            ->where('fim', '>', $inicio)
            ->exists();
    }

    /**
     * @param  list<int>  $tipoIds
     */
    private function ocupacao(CarbonInterface $inicio, CarbonInterface $fim, array $tipoIds): int
    {
        if ($tipoIds === []) {
            return 0;
        }

        return (int) $this->reservasSobrepostas($inicio, $fim, $tipoIds)->sum('animais_count');
    }

    /**
     * @return list<int>
     */
    private function idsServicosNaCasa(): array
    {
        return TipoServico::query()
            ->whereIn('slug', TipoServicoSlug::servicosNaCasa())
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    /**
     * @param  list<int>  $tipoIds
     * @return Collection<int, Reserva>
     */
    private function reservasSobrepostas(CarbonInterface $inicio, CarbonInterface $fim, array $tipoIds): Collection
    {
        return Reserva::query()
            ->withCount('animais')
            ->whereIn('tipo_servico_id', $tipoIds)
            ->whereIn('status', StatusReserva::queOcupamVaga())
            ->where('inicio', '<', $fim)
            ->where('fim', '>', $inicio)
            ->get();
    }
}
