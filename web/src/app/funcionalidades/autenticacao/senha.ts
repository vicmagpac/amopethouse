import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-recuperar-senha',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="formulario-box">
      <h1>Recuperar senha</h1>
      @if (mensagem()) { <p class="ok">{{ mensagem() }}</p> }
      @if (erros().length) {
        <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
      }
      <form [formGroup]="formulario" (ngSubmit)="enviar()">
        <label>E-mail <input type="email" formControlName="email" /></label>
        <button class="botao principal" type="submit" [disabled]="formulario.invalid || enviando()">Enviar link</button>
      </form>
      <p><a routerLink="/entrar">Voltar ao login</a></p>
    </section>
  `,
})
export class RecuperarSenha {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacao = inject(AutenticacaoService);

  protected readonly enviando = signal(false);
  protected readonly erros = signal<string[]>([]);
  protected readonly mensagem = signal('');
  protected readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  enviar() {
    this.erros.set([]);
    this.enviando.set(true);
    this.autenticacao.esqueciSenha(this.formulario.controls.email.value).subscribe({
      next: (resposta) => {
        this.mensagem.set(resposta.mensagem);
        this.enviando.set(false);
      },
      error: (erro) => {
        this.erros.set(mensagensErro(erro));
        this.enviando.set(false);
      },
    });
  }
}

@Component({
  selector: 'app-redefinir-senha',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="formulario-box">
      <h1>Nova senha</h1>
      @if (mensagem()) { <p class="ok">{{ mensagem() }}</p> }
      @if (erros().length) {
        <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
      }
      <form [formGroup]="formulario" (ngSubmit)="enviar()">
        <label>E-mail <input type="email" formControlName="email" /></label>
        <label>Nova senha <input type="password" formControlName="senha" /></label>
        <label>Confirmar senha <input type="password" formControlName="senha_confirmation" /></label>
        <button class="botao principal" type="submit" [disabled]="formulario.invalid || enviando()">Salvar senha</button>
      </form>
      <p><a routerLink="/entrar">Entrar</a></p>
    </section>
  `,
})
export class RedefinirSenha {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly erros = signal<string[]>([]);
  protected readonly mensagem = signal('');
  protected readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    token: ['', Validators.required],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    senha_confirmation: ['', Validators.required],
  });

  constructor() {
    const query = this.rota.snapshot.queryParamMap;
    this.formulario.patchValue({
      email: query.get('email') ?? '',
      token: query.get('token') ?? '',
    });
  }

  enviar() {
    this.erros.set([]);
    this.enviando.set(true);
    this.autenticacao.redefinirSenha(this.formulario.getRawValue()).subscribe({
      next: (resposta) => {
        this.mensagem.set(resposta.mensagem);
        this.enviando.set(false);
        setTimeout(() => void this.router.navigate(['/entrar']), 1200);
      },
      error: (erro) => {
        this.erros.set(mensagensErro(erro));
        this.enviando.set(false);
      },
    });
  }
}
