<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\AtualizarTipoServicoRequest;
use App\Http\Resources\Api\V1\TipoServicoResource;
use App\Models\TipoServico;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TipoServicoController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $consulta = TipoServico::query()->orderBy('id');

        if (! request()->user()?->eAdministrador()) {
            $consulta->where('ativo', true);
        }

        return TipoServicoResource::collection($consulta->get());
    }

    public function atualizar(AtualizarTipoServicoRequest $request, TipoServico $tipoServico): TipoServicoResource
    {
        $tipoServico->update($request->validated());

        return new TipoServicoResource($tipoServico->refresh());
    }
}
