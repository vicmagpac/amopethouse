<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\AtualizarPerfilRequest;
use App\Http\Requests\Api\V1\CadastrarUsuarioRequest;
use App\Http\Requests\Api\V1\EntrarRequest;
use App\Http\Requests\Api\V1\EsqueciSenhaRequest;
use App\Http\Requests\Api\V1\RedefinirSenhaRequest;
use App\Http\Resources\Api\V1\UsuarioResource;
use App\Models\Usuario;
use App\Services\AutenticacaoService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AutenticacaoController extends Controller
{
    public function __construct(private readonly AutenticacaoService $autenticacao) {}

    public function cadastrar(CadastrarUsuarioRequest $request): JsonResponse
    {
        $resultado = $this->autenticacao->cadastrar($request->validated());

        return (new UsuarioResource($resultado['usuario']))
            ->additional(['token' => $resultado['token']])
            ->response()
            ->setStatusCode(201);
    }

    public function entrar(EntrarRequest $request): UsuarioResource
    {
        $resultado = $this->autenticacao->entrar(
            $request->string('email')->toString(),
            $request->string('senha')->toString(),
        );

        return (new UsuarioResource($resultado['usuario']))
            ->additional(['token' => $resultado['token']]);
    }

    public function sair(Request $request): JsonResponse
    {
        /** @var Usuario $usuario */
        $usuario = $request->user();
        $this->autenticacao->sair($usuario);

        return response()->json(['mensagem' => 'Sessão encerrada.']);
    }

    public function usuario(Request $request): UsuarioResource
    {
        return new UsuarioResource($request->user());
    }

    public function atualizarPerfil(AtualizarPerfilRequest $request): UsuarioResource
    {
        /** @var Usuario $usuario */
        $usuario = $request->user();

        return new UsuarioResource(
            $this->autenticacao->atualizarPerfil($usuario, $request->validated())
        );
    }

    public function esqueciSenha(EsqueciSenhaRequest $request): JsonResponse
    {
        $mensagem = $this->autenticacao->enviarLinkSenha($request->string('email')->toString());

        return response()->json(['mensagem' => $mensagem]);
    }

    public function redefinirSenha(RedefinirSenhaRequest $request): JsonResponse
    {
        $this->autenticacao->redefinirSenha($request->validated());

        return response()->json(['mensagem' => 'Senha redefinida com sucesso.']);
    }

    public function verificarEmail(Request $request, int $id, string $hash): RedirectResponse
    {
        $usuario = Usuario::query()->findOrFail($id);

        if (! hash_equals($hash, sha1($usuario->getEmailForVerification()))) {
            throw new AuthorizationException;
        }

        $this->autenticacao->verificarEmail($usuario);

        return redirect()->away(config('app.frontend_url').'/entrar?verificado=1');
    }

    public function reenviarVerificacao(Request $request): JsonResponse
    {
        /** @var Usuario $usuario */
        $usuario = $request->user();

        if ($usuario->hasVerifiedEmail()) {
            return response()->json(['mensagem' => 'E-mail já verificado.']);
        }

        $usuario->sendEmailVerificationNotification();

        return response()->json(['mensagem' => 'Enviamos um novo link de verificação.']);
    }
}
