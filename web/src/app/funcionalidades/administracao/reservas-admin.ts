import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Reserva, TipoServico } from '../../nucleo/modelos';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { dataHora, reais } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-reservas-admin',
  imports: [ReactiveFormsModule, MatCardModule, MatTableModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  template: `
    <h1>Reservas</h1>
    <p class="subtitulo">Confirme a operação, inicie o cuidado e marque o pagamento no checkout presencial.</p>

    @if (erros().length) {
      <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
    }

    <form class="filtros" [formGroup]="filtros" (ngSubmit)="carregar()">
      <mat-form-field appearance="outline">
        <mat-label>Status</mat-label>
        <mat-select formControlName="status">
          <mat-option value="">Todos</mat-option>
          <mat-option value="confirmada">Confirmada</mat-option>
          <mat-option value="em_andamento">Em andamento</mat-option>
          <mat-option value="concluida">Concluída</mat-option>
          <mat-option value="cancelada">Cancelada</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Serviço</mat-label>
        <mat-select formControlName="tipo_servico_id">
          <mat-option [value]="''">Todos</mat-option>
          @for (tipo of tipos(); track tipo.id) {
            <mat-option [value]="tipo.id">{{ tipo.nome }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <button matButton="filled" type="submit">Filtrar</button>
    </form>

    <mat-card appearance="outlined">
      <table mat-table [dataSource]="reservas()" class="tabela">
        <ng-container matColumnDef="quando">
          <th mat-header-cell *matHeaderCellDef>Quando</th>
          <td mat-cell *matCellDef="let reserva">{{ dataHora(reserva.inicio) }}</td>
        </ng-container>
        <ng-container matColumnDef="tutor">
          <th mat-header-cell *matHeaderCellDef>Tutor</th>
          <td mat-cell *matCellDef="let reserva">{{ reserva.tutor?.nome }}</td>
        </ng-container>
        <ng-container matColumnDef="servico">
          <th mat-header-cell *matHeaderCellDef>Serviço</th>
          <td mat-cell *matCellDef="let reserva">{{ reserva.tipo_servico?.nome }}</td>
        </ng-container>
        <ng-container matColumnDef="pets">
          <th mat-header-cell *matHeaderCellDef>Pets</th>
          <td mat-cell *matCellDef="let reserva">{{ nomes(reserva) }}</td>
        </ng-container>
        <ng-container matColumnDef="valor">
          <th mat-header-cell *matHeaderCellDef>Valor</th>
          <td mat-cell *matCellDef="let reserva">{{ reais(reserva.valor_total) }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let reserva">
            {{ reserva.status_rotulo }}
            <div class="pago">{{ reserva.pagamento?.status_rotulo }}</div>
          </td>
        </ng-container>
        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let reserva">
            @if (reserva.status === 'confirmada') {
              <button matButton="tonal" type="button" (click)="agir('iniciar', reserva)">Iniciar</button>
            }
            @if (reserva.status === 'em_andamento') {
              <button matButton="tonal" type="button" (click)="agir('concluir', reserva)">Concluir</button>
            }
            @if (reserva.pagamento?.status === 'a_receber' && reserva.status !== 'cancelada') {
              <button matButton="filled" type="button" (click)="agir('pago', reserva)">Recebido</button>
            }
            @if (reserva.status === 'confirmada' || reserva.status === 'em_andamento') {
              <button matButton="text" type="button" (click)="agir('cancelar', reserva)">Cancelar</button>
            }
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="colunas"></tr>
        <tr mat-row *matRowDef="let row; columns: colunas"></tr>
      </table>
    </mat-card>
  `,
  styles: `
    h1 { margin-bottom: 0.25rem; }
    .subtitulo { margin-top: 0; color: #5b6f55; }
    .filtros { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; margin: 1rem 0; }
    .tabela { width: 100%; }
    .pago { font-size: 0.78rem; color: #5b6f55; }
    td button { margin: 0.15rem; }
  `,
})
export class ReservasAdmin implements OnInit {
  private readonly api = inject(ReservaService);
  private readonly fb = inject(FormBuilder);

  protected readonly reservas = signal<Reserva[]>([]);
  protected readonly tipos = signal<TipoServico[]>([]);
  protected readonly erros = signal<string[]>([]);
  protected readonly colunas = ['quando', 'tutor', 'servico', 'pets', 'valor', 'status', 'acoes'];
  protected readonly reais = reais;
  protected readonly dataHora = dataHora;
  protected readonly filtros = this.fb.nonNullable.group({
    status: [''],
    tipo_servico_id: ['' as string | number],
  });

  ngOnInit() {
    this.api.tiposAdmin().subscribe({ next: (resposta) => this.tipos.set(resposta.data) });
    this.carregar();
  }

  carregar() {
    const bruto = this.filtros.getRawValue();
    const filtros: { status?: string; tipo_servico_id?: number } = {};
    if (bruto.status) {
      filtros.status = bruto.status;
    }
    if (bruto.tipo_servico_id !== '') {
      filtros.tipo_servico_id = Number(bruto.tipo_servico_id);
    }
    this.api.listarAdmin(filtros).subscribe({
      next: (resposta) => this.reservas.set(resposta.data),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  nomes(reserva: Reserva) {
    return (reserva.animais ?? []).map((animal) => animal.nome).join(', ') || '—';
  }

  agir(acao: 'iniciar' | 'concluir' | 'pago' | 'cancelar', reserva: Reserva) {
    const pedido =
      acao === 'iniciar'
        ? this.api.iniciar(reserva.id)
        : acao === 'concluir'
          ? this.api.concluir(reserva.id)
          : acao === 'pago'
            ? this.api.marcarPago(reserva.id)
            : this.api.cancelar(reserva.id);

    pedido.subscribe({
      next: () => this.carregar(),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }
}
