import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { CamposEndereco } from '../../compartilhado/formulario/campos-endereco';
import { Mascara } from '../../compartilhado/diretivas/mascara';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';
import { aplicarMascara, somenteDigitos } from '../../compartilhado/util/mascara';

@Component({
  selector: 'app-perfil',
  imports: [
    ReactiveFormsModule,
    CamposEndereco,
    Mascara,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatSnackBarModule,
  ],
  template: `
    <mat-card appearance="outlined" class="painel-conta">
      <mat-card-header>
        <mat-card-title>Meu perfil</mat-card-title>
        <mat-card-subtitle>Dados para contato, endereço e emergência.</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        @if (mensagem()) {
          <p class="ok">{{ mensagem() }}</p>
        }
        @if (erros().length) {
          <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
        }
        <form class="conta-form grade" [formGroup]="formulario" (ngSubmit)="salvar()">
          <mat-form-field appearance="outline">
            <mat-label>Nome</mat-label>
            <input matInput formControlName="nome" autocomplete="name" />
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
          <app-campos-endereco />
          <mat-form-field appearance="outline">
            <mat-label>Contato de emergência</mat-label>
            <input matInput formControlName="contato_emergencia_nome" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Telefone de emergência</mat-label>
            <input
              matInput
              formControlName="contato_emergencia_telefone"
              mascara="telefone"
              placeholder="(85) 99999-9999"
              inputmode="tel"
              maxlength="15"
            />
          </mat-form-field>
          <div class="acoes">
            <button matButton="filled" type="submit" [disabled]="formulario.invalid || enviando()">
              <mat-icon>save</mat-icon>
              Salvar
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .painel-conta {
      max-width: 820px;
    }
    mat-card-title {
      color: var(--verde);
    }
    .grade {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.25rem 1rem;
      margin-top: 0.5rem;
    }
    app-campos-endereco {
      grid-column: 1 / -1;
    }
    .acoes {
      grid-column: 1 / -1;
      margin-top: 0.5rem;
    }
    @media (max-width: 640px) {
      .grade {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Perfil implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly avisos = inject(MatSnackBar);

  protected readonly enviando = signal(false);
  protected readonly erros = signal<string[]>([]);
  protected readonly mensagem = signal('');
  protected readonly formulario = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    telefone: ['', Validators.required],
    rua: [''],
    numero: [''],
    complemento: [''],
    bairro: [''],
    cidade: [''],
    estado: [''],
    cep: [''],
    contato_emergencia_nome: [''],
    contato_emergencia_telefone: [''],
  });

  ngOnInit() {
    const usuario = this.autenticacao.usuario();
    if (usuario) {
      this.formulario.patchValue(
        {
          nome: usuario.nome,
          telefone: aplicarMascara(usuario.telefone, 'telefone'),
          rua: usuario.rua ?? '',
          numero: usuario.numero ?? '',
          complemento: usuario.complemento ?? '',
          bairro: usuario.bairro ?? '',
          cidade: usuario.cidade ?? '',
          estado: usuario.estado ?? '',
          cep: aplicarMascara(usuario.cep, 'cep'),
          contato_emergencia_nome: usuario.contato_emergencia_nome ?? '',
          contato_emergencia_telefone: aplicarMascara(usuario.contato_emergencia_telefone, 'telefone'),
        },
        { emitEvent: false },
      );
    }
  }

  salvar() {
    this.erros.set([]);
    this.mensagem.set('');
    this.enviando.set(true);
    const dados = this.formulario.getRawValue();
    this.autenticacao
      .atualizarPerfil({
        ...dados,
        telefone: somenteDigitos(dados.telefone),
        cep: somenteDigitos(dados.cep) || null,
        contato_emergencia_telefone: somenteDigitos(dados.contato_emergencia_telefone) || null,
        estado: dados.estado ? dados.estado.toUpperCase() : null,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.mensagem.set('Perfil atualizado.');
          this.avisos.open('Perfil atualizado.', 'Ok', { duration: 4000 });
        },
        error: (erro) => {
          this.erros.set(mensagensErro(erro));
          this.enviando.set(false);
        },
      });
  }
}
