import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatSnackBarModule,
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
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
