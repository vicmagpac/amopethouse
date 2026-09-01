<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CriarReservaRequest;
use App\Http\Resources\Api\V1\ReservaResource;
use App\Models\Reserva;
use App\Services\ReservaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReservaController extends Controller
{
    public function __construct(private readonly ReservaService $reservas) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Reserva::class);

        $reservas = $request->user()
            ->reservas()
            ->with(['tipoServico', 'animais', 'pagamento'])
            ->latest('inicio')
            ->get();

        return ReservaResource::collection($reservas);
    }

    public function store(CriarReservaRequest $request): JsonResponse
    {
        $this->authorize('create', Reserva::class);

        $reserva = $this->reservas->criar($request->user(), $request->validated());

        return (new ReservaResource($reserva))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Reserva $reserva): ReservaResource
    {
        $this->authorize('view', $reserva);

        return new ReservaResource($reserva->load(['tipoServico', 'animais', 'pagamento', 'usuario']));
    }

    public function cancelar(Request $request, Reserva $reserva): ReservaResource
    {
        $this->authorize('cancel', $reserva);

        return new ReservaResource(
            $this->reservas->cancelar($reserva, $request->user())
        );
    }
}
