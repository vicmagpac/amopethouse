import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-cadastrar',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="formulario-box">
      <h1>Criar conta</h1>
      @if (erros().length) {
        <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
      }
      <form [formGroup]="formulario" (ngSubmit)="enviar()">
        <label>Nome <input formControlName="nome" /></label>
        <label>E-mail <input type="email" formControlName="email" /></label>
        <label>Telefone <input formControlName="telefone" placeholder="(85) 99999-9999" /></label>
        <label>CPF <input formControlName="cpf" /></label>
        <label>Senha <input type="password" formControlName="senha" /></label>
        <label>Confirmar senha <input type="password" formControlName="senha_confirmation" /></label>
        <label class="check">
          <input type="checkbox" formControlName="lgpd_consentimento" />
          Autorizo o uso dos meus dados conforme a LGPD.
        </label>
        <button class="botao principal" type="submit" [disabled]="formulario.invalid || enviando()">Cadastrar</button>
      </form>
      <p>Já tem conta? <a routerLink="/entrar">Entrar</a></p>
    </section>
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
    this.autenticacao.cadastrar(this.formulario.getRawValue()).subscribe({
      next: () => void this.router.navigate(['/conta/animais']),
      error: (erro) => {
        this.erros.set(mensagensErro(erro));
        this.enviando.set(false);
      },
    });
  }
}
