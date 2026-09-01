import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Reserva } from '../../nucleo/modelos';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { dataHora, reais } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-detalhe-reserva',
  imports: [RouterLink, MatCardModule, MatButtonModule],
  template: `
    <a matButton="text" routerLink="/conta/reservas">Voltar</a>
    @if (erros().length) {
      <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
    }
    @if (reserva(); as item) {
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ item.tipo_servico?.nome }}</mat-card-title>
          <mat-card-subtitle>{{ item.status_rotulo }} · {{ item.pagamento?.status_rotulo }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p><strong>Início:</strong> {{ dataHora(item.inicio) }}</p>
          <p><strong>Fim:</strong> {{ dataHora(item.fim) }}</p>
          @if (item.turno_rotulo) {
            <p><strong>Turno:</strong> {{ item.turno_rotulo }}</p>
          }
          @if (item.endereco) {
            <p><strong>Endereço:</strong> {{ item.endereco }}</p>
          }
          @if (item.origem) {
            <p><strong>Trecho:</strong> {{ item.origem }} → {{ item.destino }}</p>
          }
          @if (item.local_compromisso) {
            <p><strong>Local:</strong> {{ item.local_compromisso }}</p>
          }
          <p><strong>Pets:</strong> {{ nomes(item) }}</p>
          <p><strong>Valor:</strong> {{ reais(item.valor_total) }} (pagamento no local)</p>
          @if (item.observacoes) {
            <p>{{ item.observacoes }}</p>
          }
        </mat-card-content>
        <mat-card-actions>
          @if (item.status === 'confirmada') {
            <button matButton="outlined" type="button" (click)="cancelar(item)">Cancelar reserva</button>
          }
        </mat-card-actions>
      </mat-card>
    }
  `,
})
export class DetalheReserva implements OnInit {
  private readonly api = inject(ReservaService);
  private readonly rota = inject(ActivatedRoute);
  protected readonly reserva = signal<Reserva | null>(null);
  protected readonly erros = signal<string[]>([]);
  protected readonly reais = reais;
  protected readonly dataHora = dataHora;

  ngOnInit() {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    this.api.obter(id).subscribe({
      next: (resposta) => this.reserva.set(resposta.data),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  nomes(reserva: Reserva) {
    return (reserva.animais ?? []).map((animal) => animal.nome).join(', ');
  }

  cancelar(reserva: Reserva) {
    if (!confirm('Cancelar esta reserva? Até 48h antes o cancelamento é gratuito.')) {
      return;
    }
    this.api.cancelar(reserva.id).subscribe({
      next: (resposta) => this.reserva.set(resposta.data),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }
}
