import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { PainelAdmin } from '../../nucleo/modelos';
import { dataHora, reais } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-painel-admin',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIcon, MatProgressBar],
  template: `
    <div class="cabeca">
      <div>
        <h1>Dashboard</h1>
        <p>Visão da operação em Papicu — ocupação, valores a receber e agenda.</p>
      </div>
      <a matButton="filled" routerLink="/admin/reservas">Ver reservas</a>
    </div>

    @if (erros().length) {
      <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
    }

    <div class="kpis">
      <article class="kpi rosa">
        <span>Hoje na casa</span>
        <strong>{{ painel()?.reservas_hoje ?? 0 }}</strong>
        <small>reservas ativas no dia</small>
        <mat-icon>pets</mat-icon>
      </article>
      <article class="kpi verde">
        <span>Próximos 7 dias</span>
        <strong>{{ painel()?.proximos_7_dias ?? 0 }}</strong>
        <small>entradas confirmadas</small>
        <mat-icon>calendar_month</mat-icon>
      </article>
      <article class="kpi sage">
        <span>A receber</span>
        <strong>{{ reais(painel()?.a_receber) }}</strong>
        <small>checkout presencial</small>
        <mat-icon>payments</mat-icon>
      </article>
      <article class="kpi escuro">
        <span>Recebido no mês</span>
        <strong>{{ reais(painel()?.recebido_mes) }}</strong>
        <small>já marcado no painel</small>
        <mat-icon>trending_up</mat-icon>
      </article>
    </div>

    <div class="grade">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Ocupação por serviço</mat-card-title>
          <mat-card-subtitle>Reservas ativas a partir de hoje, contra a capacidade cadastrada.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          @for (item of painel()?.por_servico ?? []; track item.id) {
            <div class="barra-servico">
              <div class="rotulo">
                <span>{{ item.nome }}</span>
                <b>{{ item.quantidade }}/{{ item.capacidade }}</b>
              </div>
              <mat-progress-bar mode="determinate" [value]="percentual(item.quantidade, item.capacidade)" />
            </div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Agenda próxima</mat-card-title>
          <mat-card-subtitle>As próximas entradas confirmadas.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          @if (!agenda().length) {
            <p class="vazio">Nenhuma reserva futura no momento.</p>
          } @else {
            <ul class="agenda">
              @for (reserva of agenda(); track reserva.id) {
                <li>
                  <div>
                    <strong>{{ reserva.tipo_servico?.nome }}</strong>
                    <span>{{ dataHora(reserva.inicio) }} · {{ reserva.tutor?.nome }}</span>
                  </div>
                  <em>{{ reserva.status_rotulo }}</em>
                </li>
              }
            </ul>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .cabeca { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; margin-bottom: 1.25rem; }
    h1 { margin: 0 0 0.3rem; }
    .cabeca p { margin: 0; color: #5b6f55; }
    .kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; margin-bottom: 1.25rem; }
    .kpi {
      position: relative;
      overflow: hidden;
      background: #fff;
      border-radius: 16px;
      padding: 1.1rem 1.15rem 1.2rem;
      box-shadow: 0 10px 24px rgb(28 43 31 / 8%);
      min-height: 132px;
    }
    .kpi span { display: block; font-size: 0.82rem; font-weight: 700; opacity: 0.7; }
    .kpi strong { display: block; font-size: 1.7rem; margin: 0.35rem 0 0.15rem; color: var(--verde); }
    .kpi small { color: #5b6f55; }
    .kpi mat-icon { position: absolute; right: 0.9rem; bottom: 0.7rem; font-size: 42px; width: 42px; height: 42px; opacity: 0.18; }
    .kpi.rosa { border-left: 4px solid var(--rosa); }
    .kpi.verde { border-left: 4px solid var(--verde); }
    .kpi.sage { border-left: 4px solid #8ea186; }
    .kpi.escuro { border-left: 4px solid #1c2b1f; }
    .grade { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1rem; }
    .barra-servico { margin: 0.9rem 0; }
    .rotulo { display: flex; justify-content: space-between; margin-bottom: 0.35rem; font-size: 0.9rem; }
    .agenda { list-style: none; padding: 0; margin: 0; }
    .agenda li { display: flex; justify-content: space-between; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid #edf1ea; }
    .agenda strong, .agenda span { display: block; }
    .agenda span { color: #5b6f55; font-size: 0.85rem; }
    .agenda em { font-style: normal; font-weight: 700; color: var(--verde); font-size: 0.8rem; }
    .vazio { color: #5b6f55; }
    @media (max-width: 960px) {
      .kpis, .grade { grid-template-columns: 1fr; }
    }
  `,
})
export class PainelAdminPagina implements OnInit {
  private readonly api = inject(ReservaService);
  protected readonly painel = signal<PainelAdmin | null>(null);
  protected readonly erros = signal<string[]>([]);
  protected readonly reais = reais;
  protected readonly dataHora = dataHora;
  protected readonly agenda = computed(() => this.painel()?.agenda ?? []);

  ngOnInit() {
    this.api.painelAdmin().subscribe({
      next: (resposta) => this.painel.set(resposta.data),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  protected percentual(atual: number, capacidade: number) {
    if (!capacidade) {
      return 0;
    }
    return Math.min(100, Math.round((atual / capacidade) * 100));
  }
}
