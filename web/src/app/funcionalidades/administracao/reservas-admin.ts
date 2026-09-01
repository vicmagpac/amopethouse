import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Reserva, TipoServico } from '../../nucleo/modelos';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { dataHora, reais, pago, rotuloPagamento } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-reservas-admin',
  imports: [ReactiveFormsModule, MatCardModule, MatTableModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './reservas-admin.html',
  styleUrl: './reservas-admin.scss',
})
export class ReservasAdmin implements OnInit {
  private readonly api = inject(ReservaService);
  private readonly fb = inject(FormBuilder);

  protected readonly reservas = signal<Reserva[]>([]);
  protected readonly tipos = signal<TipoServico[]>([]);
  protected readonly erros = signal<string[]>([]);
  protected readonly colunas = [
    'quando',
    'tutor',
    'servico',
    'pets',
    'valor',
    'situacao_reserva',
    'situacao_pagamento',
    'acoes',
  ];
  protected readonly reais = reais;
  protected readonly dataHora = dataHora;
  protected readonly filtros = this.fb.nonNullable.group({
    status: [''],
    tipo_servico_id: ['' as string | number],
  });

  ngOnInit() {
    this.api.tiposAdmin().subscribe({ next: (resposta) => this.tipos.set(resposta.data) });
    this.carregar();
  }

  carregar() {
    const bruto = this.filtros.getRawValue();
    const filtros: { status?: string; tipo_servico_id?: number } = {};
    if (bruto.status) {
      filtros.status = bruto.status;
    }
    if (bruto.tipo_servico_id !== '') {
      filtros.tipo_servico_id = Number(bruto.tipo_servico_id);
    }
    this.api.listarAdmin(filtros).subscribe({
      next: (resposta) => this.reservas.set(resposta.data),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  nomes(reserva: Reserva) {
    return (reserva.animais ?? []).map((animal) => animal.nome).join(', ') || '—';
  }

  estaPago(reserva: Reserva) {
    return pago(reserva.pagamento?.status);
  }

  rotuloDoPagamento(reserva: Reserva) {
    return rotuloPagamento(reserva.pagamento?.status);
  }

  agir(acao: 'confirmar' | 'iniciar' | 'concluir' | 'pago' | 'cancelar', reserva: Reserva) {
    const pedido =
      acao === 'confirmar'
        ? this.api.confirmar(reserva.id)
        : acao === 'iniciar'
          ? this.api.iniciar(reserva.id)
          : acao === 'concluir'
            ? this.api.concluir(reserva.id)
            : acao === 'pago'
              ? this.api.marcarPago(reserva.id)
              : this.api.cancelar(reserva.id);

    pedido.subscribe({
      next: () => this.carregar(),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }
}
