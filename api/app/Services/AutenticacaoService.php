<?php

namespace App\Services;

use App\Enums\PapelUsuario;
use App\Models\Usuario;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AutenticacaoService
{
    /**
     * @param  array<string, mixed>  $dados
     * @return array{usuario: Usuario, token: string}
     */
    public function cadastrar(array $dados): array
    {
        $usuario = Usuario::query()->create([
            'nome' => $dados['nome'],
            'email' => $dados['email'],
            'telefone' => $dados['telefone'] ?? null,
            'cpf' => $this->somenteDigitos($dados['cpf'] ?? null),
            'papel' => PapelUsuario::Tutor,
            'senha' => $dados['senha'],
            'rua' => $dados['rua'] ?? null,
            'numero' => $dados['numero'] ?? null,
            'complemento' => $dados['complemento'] ?? null,
            'bairro' => $dados['bairro'] ?? null,
            'cidade' => $dados['cidade'] ?? null,
            'estado' => $dados['estado'] ?? null,
            'cep' => $this->somenteDigitos($dados['cep'] ?? null),
            'contato_emergencia_nome' => $dados['contato_emergencia_nome'] ?? null,
            'contato_emergencia_telefone' => $dados['contato_emergencia_telefone'] ?? null,
            'lgpd_consentimento_em' => now(),
        ]);

        event(new Registered($usuario));

        return [
            'usuario' => $usuario,
            'token' => $usuario->createToken('web')->plainTextToken,
        ];
    }

    /**
     * @return array{usuario: Usuario, token: string}
     */
    public function entrar(string $email, string $senha): array
    {
        $usuario = Usuario::query()->where('email', $email)->first();

        if (! $usuario || ! Hash::check($senha, $usuario->senha)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais informadas estão incorretas.'],
            ]);
        }

        $usuario->tokens()->where('name', 'web')->delete();

        return [
            'usuario' => $usuario,
            'token' => $usuario->createToken('web')->plainTextToken,
        ];
    }

    public function sair(Usuario $usuario): void
    {
        $usuario->currentAccessToken()?->delete();
    }

    /**
     * @param  array<string, mixed>  $dados
     */
    public function atualizarPerfil(Usuario $usuario, array $dados): Usuario
    {
        $usuario->fill([
            'nome' => $dados['nome'] ?? $usuario->nome,
            'telefone' => $dados['telefone'] ?? $usuario->telefone,
            'rua' => $dados['rua'] ?? $usuario->rua,
            'numero' => $dados['numero'] ?? $usuario->numero,
            'complemento' => $dados['complemento'] ?? $usuario->complemento,
            'bairro' => $dados['bairro'] ?? $usuario->bairro,
            'cidade' => $dados['cidade'] ?? $usuario->cidade,
            'estado' => $dados['estado'] ?? $usuario->estado,
            'cep' => $this->somenteDigitos($dados['cep'] ?? $usuario->cep),
            'contato_emergencia_nome' => $dados['contato_emergencia_nome'] ?? $usuario->contato_emergencia_nome,
            'contato_emergencia_telefone' => $dados['contato_emergencia_telefone'] ?? $usuario->contato_emergencia_telefone,
        ])->save();

        return $usuario->refresh();
    }

    public function enviarLinkSenha(string $email): string
    {
        $status = Password::sendResetLink(['email' => $email]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return __($status);
    }

    /**
     * @param  array{email: string, senha: string, senha_confirmation: string, token: string}  $dados
     */
    public function redefinirSenha(array $dados): void
    {
        $status = Password::reset(
            [
                'email' => $dados['email'],
                'password' => $dados['senha'],
                'password_confirmation' => $dados['senha_confirmation'],
                'token' => $dados['token'],
            ],
            function (Usuario $usuario, string $senha): void {
                $usuario->forceFill([
                    'senha' => $senha,
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($usuario));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }
    }

    public function verificarEmail(Usuario $usuario): void
    {
        if (! $usuario->hasVerifiedEmail()) {
            $usuario->markEmailAsVerified();
            event(new Verified($usuario));
        }
    }

    private function somenteDigitos(?string $valor): ?string
    {
        if ($valor === null || $valor === '') {
            return null;
        }

        return preg_replace('/\D+/', '', $valor);
    }
}
