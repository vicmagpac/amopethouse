import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  template: `
    <section class="formulario-box">
      <h1>Meu perfil</h1>
      @if (mensagem()) { <p class="ok">{{ mensagem() }}</p> }
      @if (erros().length) {
        <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
      }
      <form [formGroup]="formulario" (ngSubmit)="salvar()">
        <label>Nome <input formControlName="nome" /></label>
        <label>Telefone <input formControlName="telefone" /></label>
        <label>Rua <input formControlName="rua" /></label>
        <label>Número <input formControlName="numero" /></label>
        <label>Complemento <input formControlName="complemento" /></label>
        <label>Bairro <input formControlName="bairro" /></label>
        <label>Cidade <input formControlName="cidade" /></label>
        <label>Estado <input formControlName="estado" maxlength="2" /></label>
        <label>CEP <input formControlName="cep" /></label>
        <label>Contato de emergência <input formControlName="contato_emergencia_nome" /></label>
        <label>Telefone de emergência <input formControlName="contato_emergencia_telefone" /></label>
        <button class="botao principal" type="submit" [disabled]="formulario.invalid || enviando()">Salvar</button>
      </form>
    </section>
  `,
})
export class Perfil implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacao = inject(AutenticacaoService);

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
      this.formulario.patchValue({
        nome: usuario.nome,
        telefone: usuario.telefone ?? '',
        rua: usuario.rua ?? '',
        numero: usuario.numero ?? '',
        complemento: usuario.complemento ?? '',
        bairro: usuario.bairro ?? '',
        cidade: usuario.cidade ?? '',
        estado: usuario.estado ?? '',
        cep: usuario.cep ?? '',
        contato_emergencia_nome: usuario.contato_emergencia_nome ?? '',
        contato_emergencia_telefone: usuario.contato_emergencia_telefone ?? '',
      });
    }
  }

  salvar() {
    this.erros.set([]);
    this.enviando.set(true);
    this.autenticacao.atualizarPerfil(this.formulario.getRawValue()).subscribe({
      next: () => {
        this.mensagem.set('Perfil atualizado.');
        this.enviando.set(false);
      },
      error: (erro) => {
        this.erros.set(mensagensErro(erro));
        this.enviando.set(false);
      },
    });
  }
}
