<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\TipoServicoResource;
use App\Models\TipoServico;
use App\Services\DisponibilidadeService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DisponibilidadeController extends Controller
{
    public function __construct(private readonly DisponibilidadeService $disponibilidade) {}

    public function show(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'tipo_servico_id' => ['required', 'integer', 'exists:tipos_servico,id'],
            'de' => ['nullable', 'date'],
            'ate' => ['nullable', 'date', 'after_or_equal:de'],
        ]);

        $tipo = TipoServico::query()->findOrFail($dados['tipo_servico_id']);
        $de = Carbon::parse($dados['de'] ?? now()->toDateString())->startOfDay();
        $ate = Carbon::parse($dados['ate'] ?? $de->copy()->addDays(14)->toDateString())->startOfDay();

        return response()->json([
            'data' => [
                'tipo_servico' => (new TipoServicoResource($tipo))->resolve(),
                'dias' => $this->disponibilidade->consultar($tipo, $de, $ate),
            ],
        ]);
    }
}
