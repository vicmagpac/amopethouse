<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\AtualizarConfiguracaoRequest;
use App\Models\Configuracao;
use Illuminate\Http\JsonResponse;

class ConfiguracaoController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'data' => [
                'capacidade_casa' => Configuracao::capacidadeCasa(),
            ],
        ]);
    }

    public function atualizar(AtualizarConfiguracaoRequest $request): JsonResponse
    {
        return response()->json([
            'data' => [
                'capacidade_casa' => Configuracao::definirCapacidadeCasa($request->integer('capacidade_casa')),
            ],
        ]);
    }
}
