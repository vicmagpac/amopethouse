import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Animal, DiaDisponivel, TipoServico } from '../../nucleo/modelos';
import { AnimalService } from '../../nucleo/servicos/animal.service';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { reais, dataIso } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-nova-reserva',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckbox,
  ],
  template: `
    <h1>Agendar cuidado</h1>
    <p class="subtitulo">Escolha o serviço, a data e os pets. O valor é cobrado no checkout presencial.</p>
    @if (erros().length) {
      <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
    }

    <div class="servicos">
      @for (tipo of tipos(); track tipo.id) {
        <button type="button" class="tipo" [class.ativo]="tipo.id === tipoId()" (click)="escolherTipo(tipo)">
          <strong>{{ tipo.nome }}</strong>
          <span>{{ reais(tipo.preco) }}</span>
          <small>{{ tipo.descricao }}</small>
        </button>
      }
    </div>

    @if (tipoSelecionado(); as tipo) {
      <mat-card appearance="outlined">
        <mat-card-content>
          <form class="conta-form grade" [formGroup]="formulario" (ngSubmit)="enviar()">
            <mat-form-field appearance="outline">
              <mat-label>{{ tipo.slug === 'hospedagem' ? 'Entrada' : 'Data' }}</mat-label>
              <input matInput type="date" formControlName="data_inicio" (change)="pedirDisponibilidade()" />
            </mat-form-field>

            @if (tipo.slug === 'hospedagem') {
              <mat-form-field appearance="outline">
                <mat-label>Saída</mat-label>
                <input matInput type="date" formControlName="data_fim" />
              </mat-form-field>
            }

            @if (tipo.slug === 'creche') {
              <mat-form-field appearance="outline">
                <mat-label>Turno</mat-label>
                <mat-select formControlName="turno">
                  @for (turno of turnosDoDia(); track turno.turno) {
                    <mat-option [value]="turno.turno" [disabled]="!turno.disponivel">
                      {{ turno.rotulo }} · {{ turno.vagas }} vagas
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>
            }

            @if (porHorario()) {
              <mat-form-field appearance="outline">
                <mat-label>Horário</mat-label>
                <mat-select formControlName="horario">
                  @for (hora of horariosDoDia(); track hora) {
                    <mat-option [value]="hora">{{ hora }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            }

            @if (tipo.slug === 'cuidador') {
              <mat-form-field appearance="outline" class="largo">
                <mat-label>Endereço da visita</mat-label>
                <input matInput formControlName="endereco" />
              </mat-form-field>
            }
            @if (tipo.slug === 'transporte') {
              <mat-form-field appearance="outline">
                <mat-label>Origem</mat-label>
                <input matInput formControlName="origem" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Destino</mat-label>
                <input matInput formControlName="destino" />
              </mat-form-field>
            }
            @if (tipo.slug === 'acompanhamento') {
              <mat-form-field appearance="outline" class="largo">
                <mat-label>Local do compromisso</mat-label>
                <input matInput formControlName="local_compromisso" />
              </mat-form-field>
            }

            <div class="pets largo">
              <p>Quais pets vão?</p>
              @for (animal of animais(); track animal.id) {
                <mat-checkbox [checked]="selecionados().includes(animal.id)" (change)="alternarPet(animal.id)">
                  {{ animal.nome }} · {{ animal.especie_rotulo }}
                </mat-checkbox>
              }
              @if (!animais().length) {
                <p>Cadastre um animal antes de agendar. <a routerLink="/conta/animais/novo">Adicionar pet</a></p>
              }
            </div>

            <mat-form-field appearance="outline" class="largo">
              <mat-label>Observações</mat-label>
              <textarea matInput rows="3" formControlName="observacoes"></textarea>
            </mat-form-field>

            <div class="acoes largo">
              <button matButton="filled" type="submit" [disabled]="enviando() || !selecionados().length">
                Confirmar reserva
              </button>
              <a matButton="outlined" routerLink="/conta/reservas">Cancelar</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `
    h1 { margin-bottom: 0.25rem; }
    .subtitulo { color: #5b6f55; }
    .servicos { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
    .tipo {
      text-align: left;
      border: 1px solid #d5ddd0;
      background: #fff;
      border-radius: 16px;
      padding: 0.9rem;
      cursor: pointer;
      font: inherit;
    }
    .tipo.ativo { border-color: var(--verde); box-shadow: 0 0 0 2px rgb(74 103 65 / 20%); }
    .tipo strong, .tipo span, .tipo small { display: block; }
    .tipo span { color: var(--verde); font-weight: 800; margin: 0.2rem 0; }
    .tipo small { color: #5b6f55; }
    .grade { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem; }
    .largo, .acoes { grid-column: 1 / -1; }
    .pets { display: flex; flex-direction: column; gap: 0.35rem; margin: 0.5rem 0; }
    @media (max-width: 700px) { .grade { grid-template-columns: 1fr; } .largo, .acoes { grid-column: 1; } }
  `,
})
export class NovaReserva implements OnInit {
  private readonly api = inject(ReservaService);
  private readonly animaisApi = inject(AnimalService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly tipos = signal<TipoServico[]>([]);
  protected readonly animais = signal<Animal[]>([]);
  protected readonly selecionados = signal<number[]>([]);
  protected readonly tipoId = signal<number | null>(null);
  protected readonly dias = signal<DiaDisponivel[]>([]);
  protected readonly erros = signal<string[]>([]);
  protected readonly enviando = signal(false);
  protected readonly reais = reais;

  protected readonly formulario = this.fb.nonNullable.group({
    data_inicio: ['', Validators.required],
    data_fim: [''],
    turno: [''],
    horario: [''],
    endereco: [''],
    origem: [''],
    destino: [''],
    local_compromisso: [''],
    observacoes: [''],
  });

  protected readonly tipoSelecionado = computed(
    () => this.tipos().find((tipo) => tipo.id === this.tipoId()) ?? null,
  );
  protected readonly porHorario = computed(() => {
    const slug = this.tipoSelecionado()?.slug;
    return !!slug && !['hospedagem', 'creche'].includes(slug);
  });
  protected readonly diaAtual = computed(() => {
    const data = this.formulario.controls.data_inicio.value;
    return this.dias().find((dia) => dia.data === data);
  });
  protected readonly turnosDoDia = computed(() => this.diaAtual()?.turnos ?? []);
  protected readonly horariosDoDia = computed(() => this.diaAtual()?.horarios ?? []);

  ngOnInit() {
    this.api.listarTipos().subscribe({ next: (resposta) => this.tipos.set(resposta.data) });
    this.animaisApi.listar().subscribe({ next: (resposta) => this.animais.set(resposta.data) });
    this.formulario.patchValue({ data_inicio: dataIso() });
  }

  escolherTipo(tipo: TipoServico) {
    this.tipoId.set(tipo.id);
    this.pedirDisponibilidade();
  }

  pedirDisponibilidade() {
    const tipo = this.tipoSelecionado();
    const de = this.formulario.controls.data_inicio.value;
    if (!tipo || !de) {
      return;
    }
    const ateDate = new Date(`${de}T12:00:00`);
    ateDate.setDate(ateDate.getDate() + 14);
    const ate = dataIso(ateDate);
    this.api.disponibilidade(tipo.id, de, ate).subscribe({
      next: (resposta) => this.dias.set(resposta.data.dias),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  alternarPet(id: number) {
    this.selecionados.update((lista) => (lista.includes(id) ? lista.filter((item) => item !== id) : [...lista, id]));
  }

  enviar() {
    const tipo = this.tipoSelecionado();
    if (!tipo) {
      return;
    }
    this.erros.set([]);
    this.enviando.set(true);
    const dados = this.formulario.getRawValue();
    this.api
      .criar({
        tipo_servico_id: tipo.id,
        animais: this.selecionados(),
        data_inicio: dados.data_inicio,
        data_fim: dados.data_fim || null,
        turno: dados.turno || null,
        horario: dados.horario || null,
        endereco: dados.endereco || null,
        origem: dados.origem || null,
        destino: dados.destino || null,
        local_compromisso: dados.local_compromisso || null,
        observacoes: dados.observacoes || null,
      })
      .subscribe({
        next: (resposta) => void this.router.navigate(['/conta/reservas', resposta.data.id]),
        error: (erro) => {
          this.erros.set(mensagensErro(erro));
          this.enviando.set(false);
        },
      });
  }
}
