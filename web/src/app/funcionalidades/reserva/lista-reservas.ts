import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { Reserva } from '../../nucleo/modelos';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { dataHora, reais } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-lista-reservas',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatChipsModule, MatIcon],
  template: `
    <div class="topo">
      <div>
        <h1>Minhas reservas</h1>
        <p>Acompanhe os cuidados agendados. O pagamento acontece no checkout presencial.</p>
      </div>
      <a matButton="filled" routerLink="/conta/reservas/nova">
        <mat-icon>add</mat-icon>
        Nova reserva
      </a>
    </div>
    @if (erros().length) {
      <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
    }
    @if (!reservas().length) {
      <mat-card appearance="outlined">
        <mat-card-content>
          <p>Você ainda não tem reservas. Escolha um serviço e uma data livre.</p>
          <a matButton="filled" routerLink="/conta/reservas/nova">Agendar agora</a>
        </mat-card-content>
      </mat-card>
    } @else {
      <div class="grade">
        @for (reserva of reservas(); track reserva.id) {
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-card-title>{{ reserva.tipo_servico?.nome }}</mat-card-title>
              <mat-card-subtitle>{{ dataHora(reserva.inicio) }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <mat-chip-set>
                <mat-chip>{{ reserva.status_rotulo }}</mat-chip>
                <mat-chip>{{ reserva.pagamento?.status_rotulo }}</mat-chip>
              </mat-chip-set>
              <p>{{ reais(reserva.valor_total) }}</p>
            </mat-card-content>
            <mat-card-actions>
              <a matButton [routerLink]="['/conta/reservas', reserva.id]">Ver detalhes</a>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    }
  `,
  styles: `
    .topo { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
    h1 { margin: 0 0 0.3rem; }
    p { color: #5b6f55; }
    .grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
  `,
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
}
