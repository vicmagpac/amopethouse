import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Reserva } from '../../nucleo/modelos';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { dataHora, reais, pago, rotuloPagamento } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-detalhe-reserva',
  imports: [RouterLink, MatButtonModule, MatIcon],
  templateUrl: './detalhe-reserva.html',
  styleUrl: './detalhe-reserva.scss',
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

  estaPago(reserva: Reserva) {
    return pago(reserva.pagamento?.status);
  }

  rotuloDoPagamento(reserva: Reserva) {
    return rotuloPagamento(reserva.pagamento?.status);
  }

  cancelar(reserva: Reserva) {
    const aviso =
      reserva.status === 'pendente_confirmacao'
        ? 'Cancelar este pedido? Ele ainda não foi confirmado pela equipe.'
        : 'Cancelar esta reserva? Até 48h antes o cancelamento é gratuito.';
    if (!confirm(aviso)) {
      return;
    }
    this.api.cancelar(reserva.id).subscribe({
      next: (resposta) => this.reserva.set(resposta.data),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }
}
