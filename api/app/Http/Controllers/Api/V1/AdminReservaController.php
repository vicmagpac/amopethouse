<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\StatusPagamento;
use App\Enums\StatusReserva;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CriarBloqueioRequest;
use App\Http\Resources\Api\V1\ReservaResource;
use App\Models\BloqueioEquipe;
use App\Models\Pagamento;
use App\Models\Reserva;
use App\Models\TipoServico;
use App\Services\ReservaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminReservaController extends Controller
{
    public function __construct(private readonly ReservaService $reservas) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $consulta = Reserva::query()
            ->with(['tipoServico', 'animais', 'pagamento', 'usuario'])
            ->latest('inicio');

        if ($request->filled('status')) {
            $consulta->where('status', $request->string('status'));
        }

        if ($request->filled('tipo_servico_id')) {
            $consulta->where('tipo_servico_id', $request->integer('tipo_servico_id'));
        }

        return ReservaResource::collection($consulta->get());
    }

    public function painel(): JsonResponse
    {
        $hoje = now()->startOfDay();
        $amanha = $hoje->copy()->addDay();
        $semana = $hoje->copy()->addDays(7);
        $ativas = [StatusReserva::Confirmada->value, StatusReserva::EmAndamento->value];

        $porServico = TipoServico::query()
            ->withCount([
                'reservas as reservas_ativas_count' => function ($consulta) use ($hoje, $ativas): void {
                    $consulta->whereIn('status', $ativas)->where('inicio', '>=', $hoje);
                },
            ])
            ->orderBy('id')
            ->get()
            ->map(fn (TipoServico $tipo) => [
                'id' => $tipo->id,
                'nome' => $tipo->nome,
                'slug' => $tipo->slug?->value,
                'quantidade' => (int) $tipo->reservas_ativas_count,
                'capacidade' => (int) $tipo->capacidade,
            ]);

        return response()->json([
            'data' => [
                'reservas_hoje' => Reserva::query()
                    ->whereIn('status', $ativas)
                    ->where('inicio', '<', $amanha)
                    ->where('fim', '>', $hoje)
                    ->count(),
                'proximos_7_dias' => Reserva::query()
                    ->whereNot('status', StatusReserva::Cancelada)
                    ->where('inicio', '>=', $hoje)
                    ->where('inicio', '<', $semana)
                    ->count(),
                'a_receber' => Pagamento::query()->where('status', StatusPagamento::AReceber)->sum('valor'),
                'recebido_mes' => Pagamento::query()
                    ->where('status', StatusPagamento::Recebido)
                    ->whereMonth('recebido_em', now()->month)
                    ->whereYear('recebido_em', now()->year)
                    ->sum('valor'),
                'por_servico' => $porServico,
                'agenda' => ReservaResource::collection(
                    Reserva::query()
                        ->with(['tipoServico', 'animais', 'pagamento', 'usuario'])
                        ->whereNot('status', StatusReserva::Cancelada)
                        ->where('inicio', '>=', $hoje)
                        ->orderBy('inicio')
                        ->limit(8)
                        ->get()
                )->resolve(),
            ],
        ]);
    }

    public function iniciar(Reserva $reserva): ReservaResource
    {
        $this->authorize('gerenciar', $reserva);

        return new ReservaResource($this->reservas->iniciar($reserva));
    }

    public function concluir(Reserva $reserva): ReservaResource
    {
        $this->authorize('gerenciar', $reserva);

        return new ReservaResource($this->reservas->concluir($reserva));
    }

    public function pagamento(Reserva $reserva): ReservaResource
    {
        $this->authorize('gerenciar', $reserva);

        return new ReservaResource($this->reservas->marcarPagamentoRecebido($reserva));
    }

    public function bloqueios(): JsonResponse
    {
        return response()->json([
            'data' => BloqueioEquipe::query()
                ->with('tipoServico')
                ->latest('inicio')
                ->get()
                ->map(fn (BloqueioEquipe $bloqueio) => [
                    'id' => $bloqueio->id,
                    'tipo_servico_id' => $bloqueio->tipo_servico_id,
                    'tipo_servico_nome' => $bloqueio->tipoServico?->nome,
                    'inicio' => $bloqueio->inicio?->toIso8601String(),
                    'fim' => $bloqueio->fim?->toIso8601String(),
                    'motivo' => $bloqueio->motivo,
                ]),
        ]);
    }

    public function criarBloqueio(CriarBloqueioRequest $request): JsonResponse
    {
        $bloqueio = BloqueioEquipe::query()->create($request->validated());

        return response()->json(['data' => [
            'id' => $bloqueio->id,
            'tipo_servico_id' => $bloqueio->tipo_servico_id,
            'inicio' => $bloqueio->inicio?->toIso8601String(),
            'fim' => $bloqueio->fim?->toIso8601String(),
            'motivo' => $bloqueio->motivo,
        ]], 201);
    }

    public function excluirBloqueio(BloqueioEquipe $bloqueioEquipe): JsonResponse
    {
        $bloqueioEquipe->delete();

        return response()->json(['mensagem' => 'Bloqueio removido.']);
    }
}
