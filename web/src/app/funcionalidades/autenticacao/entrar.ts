import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-entrar',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon],
  template: `
    <mat-card appearance="outlined" class="cartao-auth">
      <mat-card-header>
        <mat-card-title>Entrar</mat-card-title>
        <mat-card-subtitle>Acesse sua conta para cuidar dos seus pets.</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        @if (erros().length) {
          <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
        }
        <form class="conta-form" [formGroup]="formulario" (ngSubmit)="enviar()">
          <mat-form-field appearance="outline">
            <mat-label>E-mail</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Senha</mat-label>
            <input
              matInput
              [type]="mostrarSenha() ? 'text' : 'password'"
              formControlName="senha"
              autocomplete="current-password"
            />
            <button
              matIconButton
              matSuffix
              type="button"
              (click)="mostrarSenha.set(!mostrarSenha())"
              [attr.aria-label]="mostrarSenha() ? 'Ocultar senha' : 'Mostrar senha'"
            >
              <mat-icon>{{ mostrarSenha() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>
          <button matButton="filled" type="submit" [disabled]="formulario.invalid || enviando()">
            Entrar
          </button>
        </form>
        <p class="links"><a routerLink="/recuperar-senha">Esqueci minha senha</a></p>
        <p class="links">Ainda não tem conta? <a routerLink="/cadastrar">Cadastre-se</a></p>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .cartao-auth {
      max-width: 460px;
      margin: 2.5rem auto;
    }
    mat-card-title {
      color: var(--verde);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }
    .links {
      margin: 0.85rem 0 0;
    }
  `,
})
export class Entrar {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly erros = signal<string[]>([]);
  protected readonly mostrarSenha = signal(false);

  protected readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  enviar() {
    this.erros.set([]);
    this.enviando.set(true);
    const { email, senha } = this.formulario.getRawValue();
    this.autenticacao.entrar(email, senha).subscribe({
      next: (resposta) => {
        const destino = resposta.data.papel === 'administrador' ? '/admin' : '/conta/reservas';
        void this.router.navigate([destino]);
      },
      error: (erro) => {
        this.erros.set(mensagensErro(erro));
        this.enviando.set(false);
      },
    });
  }
}
