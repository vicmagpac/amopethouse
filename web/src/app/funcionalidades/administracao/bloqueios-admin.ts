import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BloqueioEquipe, TipoServico } from '../../nucleo/modelos';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { dataHora } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-bloqueios-admin',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h1>Bloqueios da agenda</h1>
    <p class="subtitulo">Folga, manutenção ou dia fechado. Sem vaga nesses intervalos.</p>
    @if (erros().length) {
      <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
    }

    <mat-card appearance="outlined" class="form-card">
      <mat-card-header>
        <mat-card-title>Novo bloqueio</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form class="grade" [formGroup]="formulario" (ngSubmit)="criar()">
          <mat-form-field appearance="outline">
            <mat-label>Serviço</mat-label>
            <mat-select formControlName="tipo_servico_id">
              <mat-option [value]="''">Todos os serviços</mat-option>
              @for (tipo of tipos(); track tipo.id) {
                <mat-option [value]="tipo.id">{{ tipo.nome }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Início</mat-label>
            <input matInput type="datetime-local" formControlName="inicio" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Fim</mat-label>
            <input matInput type="datetime-local" formControlName="fim" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="largo">
            <mat-label>Motivo</mat-label>
            <input matInput formControlName="motivo" />
          </mat-form-field>
          <button matButton="filled" type="submit" [disabled]="formulario.invalid">Bloquear</button>
        </form>
      </mat-card-content>
    </mat-card>

    <mat-card appearance="outlined">
      <mat-card-content>
        @if (!bloqueios().length) {
          <p class="vazio">Nenhum bloqueio cadastrado.</p>
        } @else {
          <ul class="lista">
            @for (item of bloqueios(); track item.id) {
              <li>
                <div>
                  <strong>{{ item.tipo_servico_nome || 'Todos os serviços' }}</strong>
                  <span>{{ dataHora(item.inicio) }} → {{ dataHora(item.fim) }}</span>
                  @if (item.motivo) {
                    <small>{{ item.motivo }}</small>
                  }
                </div>
                <button matButton="text" type="button" (click)="excluir(item)">Remover</button>
              </li>
            }
          </ul>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    h1 { margin-bottom: 0.25rem; }
    .subtitulo { color: #5b6f55; }
    .form-card { margin: 1rem 0; }
    .grade { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; align-items: start; }
    .largo { grid-column: 1 / -1; }
    .lista { list-style: none; padding: 0; margin: 0; }
    .lista li { display: flex; justify-content: space-between; gap: 1rem; padding: 0.85rem 0; border-bottom: 1px solid #edf1ea; }
    .lista span, .lista small { display: block; color: #5b6f55; }
    @media (max-width: 800px) { .grade { grid-template-columns: 1fr; } .largo { grid-column: 1; } }
  `,
})
export class BloqueiosAdmin implements OnInit {
  private readonly api = inject(ReservaService);
  private readonly fb = inject(FormBuilder);

  protected readonly tipos = signal<TipoServico[]>([]);
  protected readonly bloqueios = signal<BloqueioEquipe[]>([]);
  protected readonly erros = signal<string[]>([]);
  protected readonly dataHora = dataHora;
  protected readonly formulario = this.fb.nonNullable.group({
    tipo_servico_id: ['' as string | number],
    inicio: ['', Validators.required],
    fim: ['', Validators.required],
    motivo: [''],
  });

  ngOnInit() {
    this.api.tiposAdmin().subscribe({ next: (resposta) => this.tipos.set(resposta.data) });
    this.carregar();
  }

  carregar() {
    this.api.listarBloqueios().subscribe({
      next: (resposta) => this.bloqueios.set(resposta.data),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  criar() {
    const dados = this.formulario.getRawValue();
    this.api
      .criarBloqueio({
        tipo_servico_id: dados.tipo_servico_id === '' ? null : dados.tipo_servico_id,
        inicio: dados.inicio,
        fim: dados.fim,
        motivo: dados.motivo || null,
      })
      .subscribe({
        next: () => {
          this.formulario.reset({ tipo_servico_id: '', inicio: '', fim: '', motivo: '' });
          this.carregar();
        },
        error: (erro) => this.erros.set(mensagensErro(erro)),
      });
  }

  excluir(item: BloqueioEquipe) {
    this.api.excluirBloqueio(item.id).subscribe({
      next: () => this.carregar(),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }
}
