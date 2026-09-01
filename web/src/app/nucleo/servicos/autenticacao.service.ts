import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ambiente } from '../ambiente';
import { RespostaAutenticacao, Usuario } from '../modelos';

const CHAVE_TOKEN = 'amopethouse.token';
const CHAVE_USUARIO = 'amopethouse.usuario';

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly token = signal<string | null>(localStorage.getItem(CHAVE_TOKEN));
  readonly usuario = signal<Usuario | null>(this.lerUsuario());
  readonly autenticado = computed(() => !!this.token());

  cadastrar(dados: Record<string, unknown>) {
    return this.http.post<RespostaAutenticacao>(`${ambiente.apiUrl}/cadastrar`, dados).pipe(
      tap((resposta) => this.guardarSessao(resposta)),
    );
  }

  entrar(email: string, senha: string) {
    return this.http.post<RespostaAutenticacao>(`${ambiente.apiUrl}/entrar`, { email, senha }).pipe(
      tap((resposta) => this.guardarSessao(resposta)),
    );
  }

  sair() {
    return this.http.post(`${ambiente.apiUrl}/sair`, {}).pipe(
      tap(() => {
        this.limparSessao();
        void this.router.navigate(['/']);
      }),
    );
  }

  esqueciSenha(email: string) {
    return this.http.post<{ mensagem: string }>(`${ambiente.apiUrl}/esqueci-senha`, { email });
  }

  redefinirSenha(dados: { email: string; token: string; senha: string; senha_confirmation: string }) {
    return this.http.post<{ mensagem: string }>(`${ambiente.apiUrl}/redefinir-senha`, dados);
  }

  carregarUsuario() {
    return this.http.get<{ data: Usuario }>(`${ambiente.apiUrl}/usuario`).pipe(
      tap((resposta) => this.usuario.set(resposta.data)),
    );
  }

  atualizarPerfil(dados: Record<string, unknown>) {
    return this.http.put<{ data: Usuario }>(`${ambiente.apiUrl}/usuario`, dados).pipe(
      tap((resposta) => {
        this.usuario.set(resposta.data);
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.data));
      }),
    );
  }

  limparSessao() {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
    this.token.set(null);
    this.usuario.set(null);
  }

  private guardarSessao(resposta: RespostaAutenticacao) {
    localStorage.setItem(CHAVE_TOKEN, resposta.token);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.data));
    this.token.set(resposta.token);
    this.usuario.set(resposta.data);
  }

  private lerUsuario(): Usuario | null {
    const bruto = localStorage.getItem(CHAVE_USUARIO);
    if (!bruto) {
      return null;
    }
    try {
      return JSON.parse(bruto) as Usuario;
    } catch {
      return null;
    }
  }
}
