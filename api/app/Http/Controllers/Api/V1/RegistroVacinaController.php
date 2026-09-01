<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SalvarVacinaRequest;
use App\Http\Resources\Api\V1\RegistroVacinaResource;
use App\Models\Animal;
use App\Models\RegistroVacina;
use App\Services\AnimalService;
use Illuminate\Http\JsonResponse;

class RegistroVacinaController extends Controller
{
    public function __construct(private readonly AnimalService $animais) {}

    public function store(SalvarVacinaRequest $request, Animal $animal): JsonResponse
    {
        $this->authorize('update', $animal);

        $vacina = $this->animais->adicionarVacina(
            $animal,
            $request->safe()->except('documento'),
            $request->file('documento'),
        );

        return (new RegistroVacinaResource($vacina))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(Animal $animal, RegistroVacina $vacina): JsonResponse
    {
        $this->authorize('update', $animal);

        abort_unless($vacina->animal_id === $animal->id, 404);

        $this->animais->excluirVacina($vacina);

        return response()->json(['mensagem' => 'Vacina removida.']);
    }
}
