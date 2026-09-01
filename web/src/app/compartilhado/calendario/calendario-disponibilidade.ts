import { Component, computed, effect, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DiaDisponivel } from '../../nucleo/modelos';
import { dataIso } from '../util/formatacao';

@Component({
  selector: 'app-calendario-disponibilidade',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './calendario-disponibilidade.html',
  styleUrl: './calendario-disponibilidade.scss',
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
