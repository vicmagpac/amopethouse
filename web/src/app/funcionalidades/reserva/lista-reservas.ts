import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Reserva } from '../../nucleo/modelos';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { dataHora, reais, pago, rotuloPagamento } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-lista-reservas',
  imports: [RouterLink, MatButtonModule, MatIcon],
  templateUrl: './lista-reservas.html',
  styleUrl: './lista-reservas.scss',
})
export class ListaReservas implements OnInit {
  private readonly api = inject(ReservaService);
  protected readonly reservas = signal<Reserva[]>([]);
  protected readonly erros = signal<string[]>([]);
  protected readonly reais = reais;
  protected readonly dataHora = dataHora;

  ngOnInit() {
    this.api.listar().subscribe({
      next: (resposta) => this.reservas.set(resposta.data),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  nomes(reserva: Reserva) {
    const lista = (reserva.animais ?? []).map((animal) => animal.nome).join(', ');
    return lista || null;
  }

  estaPago(reserva: Reserva) {
    return pago(reserva.pagamento?.status);
  }

  rotuloDoPagamento(reserva: Reserva) {
    return rotuloPagamento(reserva.pagamento?.status);
  }
}
