import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TipoServico } from '../../nucleo/modelos';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { reais } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-servicos-admin',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggle],
  template: `
    <h1>Serviços e preços</h1>
    <p class="subtitulo">Capacidade “poucos pets por vez”, valores e se o serviço exige vacina em dia.</p>
    @if (erros().length) {
      <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
    }
    @if (ok()) {
      <p class="ok">{{ ok() }}</p>
    }

    <div class="grade">
      @for (tipo of tipos(); track tipo.id) {
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-card-title>{{ tipo.nome }}</mat-card-title>
            <mat-card-subtitle>{{ tipo.slug }} · agora {{ reais(tipo.preco) }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <form class="conta-form" [formGroup]="formularios[tipo.id]" (ngSubmit)="salvar(tipo)">
              <mat-form-field appearance="outline">
                <mat-label>Preço</mat-label>
                <input matInput type="number" step="0.01" formControlName="preco" />
              </mat-form-field>
              @if (tipo.slug === 'creche') {
                <mat-form-field appearance="outline">
                  <mat-label>Preço turno 8h</mat-label>
                  <input matInput type="number" step="0.01" formControlName="preco_turno_longo" />
                </mat-form-field>
              }
              <mat-form-field appearance="outline">
                <mat-label>Capacidade</mat-label>
                <input matInput type="number" formControlName="capacidade" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Duração (minutos)</mat-label>
                <input matInput type="number" formControlName="duracao_minutos" />
              </mat-form-field>
              <mat-slide-toggle formControlName="exige_vacina">Exige vacina</mat-slide-toggle>
              <mat-slide-toggle formControlName="ativo">Ativo no site</mat-slide-toggle>
              <button matButton="filled" type="submit">Salvar</button>
            </form>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: `
    h1 { margin-bottom: 0.25rem; }
    .subtitulo { color: #5b6f55; }
    .grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    form { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.5rem; }
    mat-slide-toggle { margin: 0.35rem 0; }
  `,
})
export class ServicosAdmin implements OnInit {
  private readonly api = inject(ReservaService);
  private readonly fb = inject(FormBuilder);

  protected readonly tipos = signal<TipoServico[]>([]);
  protected readonly erros = signal<string[]>([]);
  protected readonly ok = signal('');
  protected readonly reais = reais;
  protected formularios: Record<number, FormGroup> = {};

  ngOnInit() {
    this.api.tiposAdmin().subscribe({
      next: (resposta) => {
        this.tipos.set(resposta.data);
        for (const tipo of resposta.data) {
          this.formularios[tipo.id] = this.fb.nonNullable.group({
            preco: [Number(tipo.preco), Validators.required],
            preco_turno_longo: [Number(tipo.preco_turno_longo ?? 0)],
            capacidade: [tipo.capacidade, Validators.required],
            duracao_minutos: [tipo.duracao_minutos, Validators.required],
            exige_vacina: [tipo.exige_vacina],
            ativo: [tipo.ativo],
          });
        }
      },
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  salvar(tipo: TipoServico) {
    const dados = this.formularios[tipo.id].getRawValue();
    this.api.atualizarTipo(tipo.id, dados).subscribe({
      next: () => this.ok.set(`${tipo.nome} atualizado.`),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }
}
