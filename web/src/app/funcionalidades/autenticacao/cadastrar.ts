import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { Mascara } from '../../compartilhado/diretivas/mascara';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';
import { somenteDigitos } from '../../compartilhado/util/mascara';

@Component({
  selector: 'app-cadastrar',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Mascara,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIcon,
  ],
  template: `
    <mat-card appearance="outlined" class="cartao-auth">
      <mat-card-header>
        <mat-card-title>Criar conta</mat-card-title>
        <mat-card-subtitle>Cadastre-se para hospedar e cuidar do seu pet em Papicu.</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        @if (erros().length) {
          <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
        }
        <form class="conta-form" [formGroup]="formulario" (ngSubmit)="enviar()">
          <mat-form-field appearance="outline">
            <mat-label>Nome</mat-label>
            <input matInput formControlName="nome" autocomplete="name" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>E-mail</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Telefone</mat-label>
            <input
              matInput
              formControlName="telefone"
              mascara="telefone"
              placeholder="(85) 99999-9999"
              inputmode="tel"
              autocomplete="tel"
              maxlength="15"
            />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>CPF</mat-label>
            <input
              matInput
              formControlName="cpf"
              mascara="cpf"
              placeholder="000.000.000-00"
              inputmode="numeric"
              maxlength="14"
            />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Senha</mat-label>
            <input matInput type="password" formControlName="senha" autocomplete="new-password" />
            <mat-hint>Mínimo de 8 caracteres</mat-hint>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Confirmar senha</mat-label>
            <input matInput type="password" formControlName="senha_confirmation" autocomplete="new-password" />
          </mat-form-field>
          <mat-checkbox formControlName="lgpd_consentimento">
            Autorizo o uso dos meus dados conforme a LGPD.
          </mat-checkbox>
          <button matButton="filled" type="submit" [disabled]="formulario.invalid || enviando()">
            <mat-icon>person_add</mat-icon>
            Cadastrar
          </button>
        </form>
        <p class="links">Já tem conta? <a routerLink="/entrar">Entrar</a></p>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .cartao-auth {
      max-width: 480px;
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
    mat-checkbox {
      margin: 0.35rem 0 0.85rem;
    }
    .links {
      margin: 0.85rem 0 0;
    }
  `,
})
export class Cadastrar {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly erros = signal<string[]>([]);

  protected readonly formulario = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.required],
    cpf: ['', Validators.required],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    senha_confirmation: ['', Validators.required],
    lgpd_consentimento: [false, Validators.requiredTrue],
  });

  enviar() {
    this.erros.set([]);
    this.enviando.set(true);
    const dados = this.formulario.getRawValue();
    this.autenticacao
      .cadastrar({
        ...dados,
        telefone: somenteDigitos(dados.telefone),
        cpf: somenteDigitos(dados.cpf),
      })
      .subscribe({
        next: () => void this.router.navigate(['/conta/animais']),
        error: (erro) => {
          this.erros.set(mensagensErro(erro));
          this.enviando.set(false);
        },
      });
  }
}
