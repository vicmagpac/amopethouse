import { Component, computed, effect, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DiaDisponivel } from '../../nucleo/modelos';
import { dataIso } from '../util/formatacao';

@Component({
  selector: 'app-calendario-disponibilidade',
  imports: [MatButtonModule, MatIcon],
  template: `
    <div class="topo">
      <button matIconButton type="button" (click)="mudar(-1)" aria-label="Mês anterior">
        <mat-icon>chevron_left</mat-icon>
      </button>
      <strong>{{ titulo() }}</strong>
      <button matIconButton type="button" (click)="mudar(1)" aria-label="Próximo mês">
        <mat-icon>chevron_right</mat-icon>
      </button>
    </div>
    <div class="grade">
      @for (rotulo of semanas; track rotulo) {
        <span class="cabeca">{{ rotulo }}</span>
      }
      @for (celula of celulas(); track celula.chave) {
        <button
          type="button"
          class="dia"
          [class.fora]="celula.fora"
          [class.disponivel]="celula.disponivel"
          [class.indisponivel]="!celula.disponivel && !celula.fora"
          [class.selecionado]="celula.selecionado"
          [disabled]="celula.fora || !celula.disponivel"
          (click)="escolher.emit(celula.data)"
        >
          <span>{{ celula.dia }}</span>
          @if (celula.vagas != null && celula.disponivel) {
            <small>{{ celula.vagas }}</small>
          }
        </button>
      }
    </div>
  `,
  styles: `
    .topo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.6rem;
    }
    .topo strong {
      text-transform: capitalize;
      color: var(--verde);
    }
    .grade {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 0.35rem;
    }
    .cabeca {
      text-align: center;
      font-size: 0.72rem;
      font-weight: 800;
      color: #5b6f55;
      letter-spacing: 0.04em;
    }
    .dia {
      min-height: 52px;
      border: 1px solid #d5ddd0;
      background: #fff;
      border-radius: 12px;
      cursor: pointer;
      font: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.05rem;
      color: var(--texto);
    }
    .dia small {
      font-size: 0.68rem;
      color: var(--verde);
      font-weight: 700;
    }
    .dia.disponivel:hover {
      border-color: var(--verde);
    }
    .dia.selecionado {
      border-color: var(--verde);
      box-shadow: 0 0 0 2px rgb(74 103 65 / 22%);
      background: #eef4ea;
    }
    .dia.indisponivel,
    .dia:disabled {
      opacity: 0.42;
      cursor: not-allowed;
      background: #f1f1ee;
    }
    .dia.fora {
      visibility: hidden;
    }
  `,
})
export class CalendarioDisponibilidade {
  readonly dias = input<DiaDisponivel[]>([]);
  readonly selecionada = input<string | null>(null);
  readonly escolher = output<string>();
  readonly intervalo = output<{ de: string; ate: string }>();

  protected readonly semanas = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  protected readonly cursor = signal(inicioDoMes(new Date()));

  protected readonly titulo = computed(() =>
    this.cursor().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
  );

  protected readonly celulas = computed(() => {
    const mes = this.cursor();
    const mapa = new Map(this.dias().map((dia) => [dia.data, dia]));
    const selecionada = this.selecionada();
    const primeiro = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const deslocamento = primeiro.getDay();
    const total = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    const itens: {
      chave: string;
      data: string;
      dia: number;
      fora: boolean;
      disponivel: boolean;
      vagas?: number;
      selecionado: boolean;
    }[] = [];

    for (let i = 0; i < deslocamento; i++) {
      itens.push({
        chave: `vazio-${i}`,
        data: '',
        dia: 0,
        fora: true,
        disponivel: false,
        selecionado: false,
      });
    }

    for (let dia = 1; dia <= total; dia++) {
      const data = dataIso(new Date(mes.getFullYear(), mes.getMonth(), dia));
      const info = mapa.get(data);
      itens.push({
        chave: data,
        data,
        dia,
        fora: false,
        disponivel: !!info?.disponivel,
        vagas: info?.vagas,
        selecionado: selecionada === data,
      });
    }

    return itens;
  });

  constructor() {
    effect(() => {
      const mes = this.cursor();
      const de = dataIso(new Date(mes.getFullYear(), mes.getMonth(), 1));
      const ate = dataIso(new Date(mes.getFullYear(), mes.getMonth() + 1, 0));
      this.intervalo.emit({ de, ate });
    });
  }

  mudar(delta: number) {
    const atual = this.cursor();
    this.cursor.set(new Date(atual.getFullYear(), atual.getMonth() + delta, 1));
  }
}

function inicioDoMes(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), 1);
}
