<?php

namespace App\Services;

use App\Models\Animal;
use App\Models\RegistroVacina;
use App\Models\Usuario;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AnimalService
{
    /**
     * @param  array<string, mixed>  $dados
     */
    public function criar(Usuario $usuario, array $dados): Animal
    {
        return $usuario->animais()->create($dados);
    }

    /**
     * @param  array<string, mixed>  $dados
     */
    public function atualizar(Animal $animal, array $dados): Animal
    {
        $animal->update($dados);

        return $animal->refresh()->load('registrosVacinas');
    }

    public function excluir(Animal $animal): void
    {
        if ($animal->foto_caminho) {
            Storage::disk('public')->delete($animal->foto_caminho);
        }

        foreach ($animal->registrosVacinas as $vacina) {
            if ($vacina->documento_caminho) {
                Storage::disk('public')->delete($vacina->documento_caminho);
            }
        }

        $animal->delete();
    }

    public function salvarFoto(Animal $animal, UploadedFile $arquivo): Animal
    {
        if ($animal->foto_caminho) {
            Storage::disk('public')->delete($animal->foto_caminho);
        }

        $caminho = $arquivo->store("animais/{$animal->id}", 'public');
        $animal->update(['foto_caminho' => $caminho]);

        return $animal->refresh();
    }

    /**
     * @param  array<string, mixed>  $dados
     */
    public function adicionarVacina(Animal $animal, array $dados, ?UploadedFile $documento = null): RegistroVacina
    {
        if ($documento) {
            $dados['documento_caminho'] = $documento->store("animais/{$animal->id}/vacinas", 'public');
        }

        return $animal->registrosVacinas()->create($dados);
    }

    public function excluirVacina(RegistroVacina $vacina): void
    {
        if ($vacina->documento_caminho) {
            Storage::disk('public')->delete($vacina->documento_caminho);
        }

        $vacina->delete();
    }
}
