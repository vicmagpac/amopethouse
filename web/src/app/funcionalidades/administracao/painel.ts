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
  templateUrl: './painel.html',
  styleUrl: './painel.scss',
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
