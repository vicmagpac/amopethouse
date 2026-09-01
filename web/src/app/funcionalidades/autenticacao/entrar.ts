import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-entrar',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="formulario-box">
      <h1>Entrar</h1>
      @if (erros().length) {
        <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
      }
      <form [formGroup]="formulario" (ngSubmit)="enviar()">
        <label>E-mail <input type="email" formControlName="email" /></label>
        <label>Senha <input type="password" formControlName="senha" /></label>
        <button class="botao principal" type="submit" [disabled]="formulario.invalid || enviando()">Entrar</button>
      </form>
      <p><a routerLink="/recuperar-senha">Esqueci minha senha</a></p>
      <p>Ainda não tem conta? <a routerLink="/cadastrar">Cadastre-se</a></p>
    </section>
  `,
})
export class Entrar {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly erros = signal<string[]>([]);

  protected readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  enviar() {
    this.erros.set([]);
    this.enviando.set(true);
    const { email, senha } = this.formulario.getRawValue();
    this.autenticacao.entrar(email, senha).subscribe({
      next: () => void this.router.navigate(['/conta/animais']),
      error: (erro) => {
        this.erros.set(mensagensErro(erro));
        this.enviando.set(false);
      },
    });
  }
}
