<?php

namespace App\Services;

use App\Enums\MeioPagamento;
use App\Enums\StatusPagamento;
use App\Enums\StatusReserva;
use App\Enums\TipoTurno;
use App\Models\Animal;
use App\Models\Reserva;
use App\Models\TipoServico;
use App\Models\Usuario;
use App\Notifications\ReservaConfirmada;
use App\Notifications\ReservaSolicitada;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservaService
{
    public function __construct(private readonly DisponibilidadeService $disponibilidade) {}

    /**
     * @param  array<string, mixed>  $dados
     */
    public function criar(Usuario $usuario, array $dados): Reserva
    {
        $tipo = TipoServico::query()->where('ativo', true)->findOrFail($dados['tipo_servico_id']);
        $animais = $this->animaisDoTutor($usuario, $dados['animais']);
        [$inicio, $fim] = $this->janela($tipo, $dados);

        if ($this->janelaJaPassou($tipo, $inicio)) {
            throw ValidationException::withMessages([
                'inicio' => $tipo->slug->ePorNoite()
                    ? 'A entrada precisa ser hoje ou uma data futura.'
                    : 'Escolha uma data e horário futuros.',
            ]);
        }

        $this->garantirVacinas($tipo, $animais, $inicio);

        if (! $this->disponibilidade->cabe($tipo, $inicio, $fim, $animais->count())) {
            throw ValidationException::withMessages([
                'inicio' => 'Não há vaga neste horário. Escolha outra data.',
            ]);
        }

        $valor = $this->calcularValor($tipo, $inicio, $fim, $dados['turno'] ?? null, $animais->count());

        $reserva = DB::transaction(function () use ($usuario, $tipo, $dados, $animais, $inicio, $fim, $valor) {
            $reserva = Reserva::query()->create([
                'usuario_id' => $usuario->id,
                'tipo_servico_id' => $tipo->id,
                'status' => StatusReserva::PendenteConfirmacao,
                'inicio' => $inicio,
                'fim' => $fim,
                'valor_total' => $valor,
                'turno' => $dados['turno'] ?? null,
                'endereco' => $dados['endereco'] ?? null,
                'origem' => $dados['origem'] ?? null,
                'destino' => $dados['destino'] ?? null,
                'local_compromisso' => $dados['local_compromisso'] ?? null,
                'observacoes' => $dados['observacoes'] ?? null,
            ]);

            $reserva->animais()->sync($animais->pluck('id'));
            $reserva->pagamento()->create([
                'status' => StatusPagamento::AReceber,
                'meio' => MeioPagamento::NoLocal,
                'valor' => $valor,
            ]);

            return $reserva->load(['tipoServico', 'animais', 'pagamento', 'usuario']);
        });

        $usuario->notify(new ReservaSolicitada($reserva));

        return $reserva;
    }

    public function cancelar(Reserva $reserva, Usuario $usuario): Reserva
    {
        if (in_array($reserva->status, [StatusReserva::Cancelada, StatusReserva::Concluida], true)) {
            throw ValidationException::withMessages([
                'status' => 'Esta reserva não pode mais ser cancelada.',
            ]);
        }

        if (! $usuario->eAdministrador()
            && $reserva->status !== StatusReserva::PendenteConfirmacao
            && $reserva->inicio->lt(now()->addHours(48))) {
            throw ValidationException::withMessages([
                'status' => 'O cancelamento gratuito só é permitido até 48 horas antes.',
            ]);
        }

        $reserva->update(['status' => StatusReserva::Cancelada]);

        return $reserva->fresh(['tipoServico', 'animais', 'pagamento', 'usuario']);
    }

    public function confirmar(Reserva $reserva): Reserva
    {
        $this->exigirStatus($reserva, StatusReserva::PendenteConfirmacao);
        $reserva->update(['status' => StatusReserva::Confirmada]);
        $reserva = $reserva->fresh(['tipoServico', 'animais', 'pagamento', 'usuario']);

        $reserva->usuario?->notify(new ReservaConfirmada($reserva));

        return $reserva;
    }

    public function iniciar(Reserva $reserva): Reserva
    {
        $this->exigirStatus($reserva, StatusReserva::Confirmada);
        $reserva->update(['status' => StatusReserva::EmAndamento]);

        return $reserva->fresh(['tipoServico', 'animais', 'pagamento', 'usuario']);
    }

    public function concluir(Reserva $reserva): Reserva
    {
        $this->exigirStatus($reserva, StatusReserva::EmAndamento);
        $reserva->update(['status' => StatusReserva::Concluida]);

        return $reserva->fresh(['tipoServico', 'animais', 'pagamento', 'usuario']);
    }

    public function marcarPagamentoRecebido(Reserva $reserva): Reserva
    {
        $pagamento = $reserva->pagamento;
        if (! $pagamento) {
            throw ValidationException::withMessages([
                'pagamento' => 'Esta reserva não tem pagamento registrado.',
            ]);
        }

        $pagamento->update([
            'status' => StatusPagamento::Recebido,
            'recebido_em' => now(),
        ]);

        return $reserva->fresh(['tipoServico', 'animais', 'pagamento', 'usuario']);
    }

    /**
     * @param  list<int>  $ids
     * @return Collection<int, Animal>
     */
    private function animaisDoTutor(Usuario $usuario, array $ids): Collection
    {
        $animais = $usuario->animais()->whereIn('id', $ids)->get();
        if ($animais->count() !== count(array_unique($ids))) {
            throw ValidationException::withMessages([
                'animais' => 'Selecione apenas animais da sua conta.',
            ]);
        }

        return $animais;
    }

    /**
     * @param  Collection<int, Animal>  $animais
     */
    private function garantirVacinas(TipoServico $tipo, Collection $animais, Carbon $inicio): void
    {
        if (! $tipo->exige_vacina) {
            return;
        }

        foreach ($animais as $animal) {
            $emDia = $animal->registrosVacinas()
                ->where(function ($consulta) use ($inicio): void {
                    $consulta->whereNull('expira_em')
                        ->orWhereDate('expira_em', '>=', $inicio->toDateString());
                })
                ->exists();

            if (! $emDia) {
                throw ValidationException::withMessages([
                    'animais' => "{$animal->nome} precisa de vacina em dia para este serviço.",
                ]);
            }
        }
    }

    private function janelaJaPassou(TipoServico $tipo, Carbon $inicio): bool
    {
        if ($tipo->slug->ePorNoite()) {
            return $inicio->copy()->startOfDay()->lt(now()->startOfDay());
        }

        return $inicio->lt(now());
    }

    /**
     * @param  array<string, mixed>  $dados
     * @return array{0: Carbon, 1: Carbon}
     */
    private function janela(TipoServico $tipo, array $dados): array
    {
        if ($tipo->slug->ePorNoite()) {
            $inicio = Carbon::parse($dados['data_inicio'])->setTime(10, 0);
            $fim = Carbon::parse($dados['data_fim'])->setTime(10, 0);
            if ($fim->lte($inicio)) {
                throw ValidationException::withMessages([
                    'data_fim' => 'A saída precisa ser depois da entrada.',
                ]);
            }

            return [$inicio, $fim];
        }

        if ($tipo->slug->ePorTurno()) {
            $turno = TipoTurno::from($dados['turno']);

            return $this->disponibilidade->janelaTurno(Carbon::parse($dados['data_inicio']), $turno);
        }

        $inicio = Carbon::parse($dados['data_inicio'].' '.$dados['horario']);
        $fim = $inicio->copy()->addMinutes((int) $tipo->duracao_minutos);

        return [$inicio, $fim];
    }

    private function calcularValor(TipoServico $tipo, Carbon $inicio, Carbon $fim, ?string $turno, int $quantidade): string
    {
        $unitario = (float) $tipo->preco;

        if ($tipo->slug->ePorNoite()) {
            $noites = max(1, (int) $inicio->copy()->startOfDay()->diffInDays($fim->copy()->startOfDay()));
            $unitario *= $noites;
        }

        if ($tipo->slug->ePorTurno() && $turno === TipoTurno::OitoHoras->value) {
            $unitario = (float) ($tipo->preco_turno_longo ?? round($tipo->preco * 1.7, 2));
        }

        return number_format($unitario * $quantidade, 2, '.', '');
    }

    private function exigirStatus(Reserva $reserva, StatusReserva $esperado): void
    {
        if ($reserva->status !== $esperado) {
            throw ValidationException::withMessages([
                'status' => 'Esta reserva não está no status esperado para essa ação.',
            ]);
        }
    }
}
