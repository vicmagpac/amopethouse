<?php

use App\Http\Controllers\Api\V1\AutenticacaoController;
use App\Http\Controllers\Api\V1\AnimalController;
use App\Http\Controllers\Api\V1\RegistroVacinaController;
use Illuminate\Support\Facades\Route;

Route::post('/cadastrar', [AutenticacaoController::class, 'cadastrar']);
Route::post('/entrar', [AutenticacaoController::class, 'entrar']);
Route::post('/esqueci-senha', [AutenticacaoController::class, 'esqueciSenha']);
Route::post('/redefinir-senha', [AutenticacaoController::class, 'redefinirSenha']);
Route::get('/email/verificar/{id}/{hash}', [AutenticacaoController::class, 'verificarEmail'])
    ->middleware('signed')
    ->name('verification.verify');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/sair', [AutenticacaoController::class, 'sair']);
    Route::get('/usuario', [AutenticacaoController::class, 'usuario']);
    Route::put('/usuario', [AutenticacaoController::class, 'atualizarPerfil']);
    Route::post('/email/reenviar-verificacao', [AutenticacaoController::class, 'reenviarVerificacao']);

    Route::apiResource('animais', AnimalController::class);
    Route::post('/animais/{animal}/foto', [AnimalController::class, 'enviarFoto']);
    Route::post('/animais/{animal}/vacinas', [RegistroVacinaController::class, 'store']);
    Route::delete('/animais/{animal}/vacinas/{vacina}', [RegistroVacinaController::class, 'destroy']);
});
