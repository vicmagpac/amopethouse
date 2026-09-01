import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-recuperar-senha',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card appearance="outlined" class="cartao-auth">
      <mat-card-header>
        <mat-card-title>Recuperar senha</mat-card-title>
        <mat-card-subtitle>Enviamos o link para o e-mail cadastrado.</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        @if (mensagem()) {
          <p class="ok">{{ mensagem() }}</p>
        }
        @if (erros().length) {
          <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
        }
        <form class="conta-form" [formGroup]="formulario" (ngSubmit)="enviar()">
          <mat-form-field appearance="outline">
            <mat-label>E-mail</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" />
          </mat-form-field>
          <button matButton="filled" type="submit" [disabled]="formulario.invalid || enviando()">
            Enviar link
          </button>
        </form>
        <p class="links"><a routerLink="/entrar">Voltar ao login</a></p>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .cartao-auth { max-width: 460px; margin: 2.5rem auto; }
    mat-card-title { color: var(--verde); }
    form { display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.5rem; }
    .links { margin: 0.85rem 0 0; }
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
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <mat-card appearance="outlined" class="cartao-auth">
      <mat-card-header>
        <mat-card-title>Nova senha</mat-card-title>
        <mat-card-subtitle>Defina uma senha com no mínimo 8 caracteres.</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        @if (mensagem()) {
          <p class="ok">{{ mensagem() }}</p>
        }
        @if (erros().length) {
          <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
        }
        <form class="conta-form" [formGroup]="formulario" (ngSubmit)="enviar()">
          <mat-form-field appearance="outline">
            <mat-label>E-mail</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Nova senha</mat-label>
            <input matInput type="password" formControlName="senha" autocomplete="new-password" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Confirmar senha</mat-label>
            <input matInput type="password" formControlName="senha_confirmation" autocomplete="new-password" />
          </mat-form-field>
          <button matButton="filled" type="submit" [disabled]="formulario.invalid || enviando()">
            Salvar senha
          </button>
        </form>
        <p class="links"><a routerLink="/entrar">Entrar</a></p>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .cartao-auth { max-width: 460px; margin: 2.5rem auto; }
    mat-card-title { color: var(--verde); }
    form { display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.5rem; }
    .links { margin: 0.85rem 0 0; }
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
