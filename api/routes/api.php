<?php

use App\Http\Controllers\Api\V1\AdminReservaController;
use App\Http\Controllers\Api\V1\AnimalController;
use App\Http\Controllers\Api\V1\AutenticacaoController;
use App\Http\Controllers\Api\V1\DisponibilidadeController;
use App\Http\Controllers\Api\V1\RegistroVacinaController;
use App\Http\Controllers\Api\V1\ReservaController;
use App\Http\Controllers\Api\V1\TipoServicoController;
use Illuminate\Support\Facades\Route;

Route::post('/cadastrar', [AutenticacaoController::class, 'cadastrar']);
Route::post('/entrar', [AutenticacaoController::class, 'entrar']);
Route::post('/esqueci-senha', [AutenticacaoController::class, 'esqueciSenha']);
Route::post('/redefinir-senha', [AutenticacaoController::class, 'redefinirSenha']);
Route::get('/email/verificar/{id}/{hash}', [AutenticacaoController::class, 'verificarEmail'])
    ->middleware('signed')
    ->name('verification.verify');

Route::get('/tipos-servico', [TipoServicoController::class, 'index']);
Route::get('/disponibilidade', [DisponibilidadeController::class, 'show']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/sair', [AutenticacaoController::class, 'sair']);
    Route::get('/usuario', [AutenticacaoController::class, 'usuario']);
    Route::put('/usuario', [AutenticacaoController::class, 'atualizarPerfil']);
    Route::post('/email/reenviar-verificacao', [AutenticacaoController::class, 'reenviarVerificacao']);

    Route::apiResource('animais', AnimalController::class)->parameters([
        'animais' => 'animal',
    ]);
    Route::post('/animais/{animal}/foto', [AnimalController::class, 'enviarFoto']);
    Route::post('/animais/{animal}/vacinas', [RegistroVacinaController::class, 'store']);
    Route::delete('/animais/{animal}/vacinas/{vacina}', [RegistroVacinaController::class, 'destroy']);

    Route::get('/reservas', [ReservaController::class, 'index']);
    Route::post('/reservas', [ReservaController::class, 'store']);
    Route::get('/reservas/{reserva}', [ReservaController::class, 'show']);
    Route::post('/reservas/{reserva}/cancelar', [ReservaController::class, 'cancelar']);

    Route::middleware('administrador')->prefix('admin')->group(function (): void {
        Route::get('/tipos-servico', [TipoServicoController::class, 'index']);
        Route::put('/tipos-servico/{tipoServico}', [TipoServicoController::class, 'atualizar']);
        Route::get('/reservas', [AdminReservaController::class, 'index']);
        Route::get('/painel', [AdminReservaController::class, 'painel']);
        Route::post('/reservas/{reserva}/iniciar', [AdminReservaController::class, 'iniciar']);
        Route::post('/reservas/{reserva}/concluir', [AdminReservaController::class, 'concluir']);
        Route::post('/reservas/{reserva}/pagamento', [AdminReservaController::class, 'pagamento']);
        Route::get('/bloqueios', [AdminReservaController::class, 'bloqueios']);
        Route::post('/bloqueios', [AdminReservaController::class, 'criarBloqueio']);
        Route::delete('/bloqueios/{bloqueioEquipe}', [AdminReservaController::class, 'excluirBloqueio']);
    });
});
