import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckbox,
  ],
  templateUrl: './nova-reserva.html',
  styleUrl: './nova-reserva.scss',
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

  protected readonly formulario = this.fb.group({
    data_inicio: [new Date() as Date | null, Validators.required],
    data_fim: [null as Date | null],
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
    return data ? this.dias().find((dia) => dia.data === dataIso(data)) : undefined;
  });
  protected readonly turnosDoDia = computed(() => this.diaAtual()?.turnos ?? []);
  protected readonly horariosDoDia = computed(() => this.diaAtual()?.horarios ?? []);

  ngOnInit() {
    this.api.listarTipos().subscribe({ next: (resposta) => this.tipos.set(resposta.data) });
    this.animaisApi.listar().subscribe({ next: (resposta) => this.animais.set(resposta.data) });
  }

  escolherTipo(tipo: TipoServico) {
    this.tipoId.set(tipo.id);
    this.pedirDisponibilidade();
  }

  pedirDisponibilidade() {
    const tipo = this.tipoSelecionado();
    const deDate = this.formulario.controls.data_inicio.value;
    if (!tipo || !deDate) {
      return;
    }
    const de = dataIso(deDate);
    const ateDate = new Date(deDate);
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
    const inicio = dados.data_inicio;
    if (!inicio) {
      this.enviando.set(false);
      return;
    }
    this.api
      .criar({
        tipo_servico_id: tipo.id,
        animais: this.selecionados(),
        data_inicio: dataIso(inicio),
        data_fim: dados.data_fim ? dataIso(dados.data_fim) : null,
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
