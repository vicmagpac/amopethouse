<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\EnviarFotoAnimalRequest;
use App\Http\Requests\Api\V1\SalvarAnimalRequest;
use App\Http\Resources\Api\V1\AnimalResource;
use App\Models\Animal;
use App\Services\AnimalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AnimalController extends Controller
{
    public function __construct(private readonly AnimalService $animais) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Animal::class);

        $animais = $request->user()
            ->animais()
            ->with('registrosVacinas')
            ->latest()
            ->get();

        return AnimalResource::collection($animais);
    }

    public function store(SalvarAnimalRequest $request): JsonResponse
    {
        $this->authorize('create', Animal::class);

        $animal = $this->animais->criar($request->user(), $request->validated());

        return (new AnimalResource($animal->load('registrosVacinas')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Animal $animal): AnimalResource
    {
        $this->authorize('view', $animal);

        return new AnimalResource($animal->load('registrosVacinas'));
    }

    public function update(SalvarAnimalRequest $request, Animal $animal): AnimalResource
    {
        $this->authorize('update', $animal);

        return new AnimalResource(
            $this->animais->atualizar($animal, $request->validated())
        );
    }

    public function destroy(Animal $animal): JsonResponse
    {
        $this->authorize('delete', $animal);

        $this->animais->excluir($animal);

        return response()->json(['mensagem' => 'Animal removido.']);
    }

    public function enviarFoto(EnviarFotoAnimalRequest $request, Animal $animal): AnimalResource
    {
        $this->authorize('update', $animal);

        return new AnimalResource(
            $this->animais->salvarFoto($animal, $request->file('foto'))
        );
    }
}
