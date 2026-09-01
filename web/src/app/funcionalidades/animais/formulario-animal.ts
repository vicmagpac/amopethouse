import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { AnimalService } from '../../nucleo/servicos/animal.service';
import { Animal, RegistroVacina } from '../../nucleo/modelos';
import { racasPorEspecie, TEMPERAMENTOS, vacinasPorEspecie } from '../../nucleo/listas-animal';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';
import { soData, dataIso, deIso } from '../../compartilhado/util/formatacao';

@Component({
  selector: 'app-formulario-animal',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatListModule,
    MatSelectModule,
  ],
  templateUrl: './formulario-animal.html',
  styleUrl: './formulario-animal.scss',
})
export class FormularioAnimal implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly animaisApi = inject(AnimalService);
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly id = signal<number | null>(null);
  protected readonly enviando = signal(false);
  protected readonly erros = signal<string[]>([]);
  protected readonly animal = signal<Animal | null>(null);
  protected readonly vacinas = signal<RegistroVacina[]>([]);
  protected foto?: File;
  protected documentoVacina?: File;
  protected readonly temperamentos = TEMPERAMENTOS;
  protected readonly soData = soData;
  private readonly especieAtual = signal<'cao' | 'gato'>('cao');
  private readonly racaExtra = signal('');

  protected readonly formulario = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    especie: ['cao' as 'cao' | 'gato', Validators.required],
    raca: [''],
    porte: ['pequeno', Validators.required],
    sexo: ['macho', Validators.required],
    data_nascimento: [null as Date | null],
    peso: [''],
    castrado: [false],
    temperamento: [''],
    observacoes: [''],
  });

  protected readonly racas = computed(() => {
    const lista = [...racasPorEspecie(this.especieAtual())];
    const extra = this.racaExtra();
    if (extra && !lista.includes(extra)) {
      return [extra, ...lista];
    }
    return lista;
  });

  protected readonly nomesVacina = computed(() => vacinasPorEspecie(this.especieAtual()));
  protected readonly vacinaPersonalizada = signal(false);

  protected readonly vacinaForm = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    nome_outra: [''],
    aplicada_em: [null as Date | null, Validators.required],
    expira_em: [null as Date | null],
  });

  constructor() {
    this.formulario.controls.especie.valueChanges.pipe(takeUntilDestroyed()).subscribe((especie) => {
      this.especieAtual.set(especie);
      const lista = racasPorEspecie(especie);
      if (!lista.includes(this.formulario.controls.raca.value)) {
        this.formulario.controls.raca.setValue('');
        this.racaExtra.set('');
      }
      if (!vacinasPorEspecie(especie).includes(this.vacinaForm.controls.nome.value)) {
        this.vacinaForm.controls.nome.setValue('');
      }
    });
    this.vacinaForm.controls.nome.valueChanges.pipe(takeUntilDestroyed()).subscribe((nome) => {
      const outra = nome === 'Outra';
      this.vacinaPersonalizada.set(outra);
      const campo = this.vacinaForm.controls.nome_outra;
      if (outra) {
        campo.setValidators([Validators.required]);
      } else {
        campo.clearValidators();
        campo.setValue('');
      }
      campo.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit() {
    const idParam = this.rota.snapshot.paramMap.get('id');
    if (!idParam || idParam === 'novo') {
      return;
    }
    const id = Number(idParam);
    this.id.set(id);
    this.animaisApi.obter(id).subscribe({
      next: (resposta) => {
        this.animal.set(resposta.data);
        this.vacinas.set(resposta.data.vacinas ?? []);
        this.especieAtual.set(resposta.data.especie);
        this.racaExtra.set(resposta.data.raca ?? '');
        this.formulario.patchValue(
          {
            nome: resposta.data.nome,
            especie: resposta.data.especie,
            raca: resposta.data.raca ?? '',
            porte: resposta.data.porte,
            sexo: resposta.data.sexo,
            data_nascimento: deIso(resposta.data.data_nascimento),
            peso: String(resposta.data.peso ?? ''),
            castrado: resposta.data.castrado,
            temperamento: resposta.data.temperamento ?? '',
            observacoes: resposta.data.observacoes ?? '',
          },
          { emitEvent: false },
        );
      },
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  aoSelecionarFoto(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.foto = input.files?.[0];
  }

  aoSelecionarDocumento(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.documentoVacina = input.files?.[0];
  }

  salvar() {
    this.erros.set([]);
    this.enviando.set(true);
    const bruto = this.formulario.getRawValue();
    const dados: Record<string, unknown> = {
      ...bruto,
      peso: bruto.peso ? Number(bruto.peso) : null,
      data_nascimento: bruto.data_nascimento ? dataIso(bruto.data_nascimento) : null,
    };
    const requisicao = this.id()
      ? this.animaisApi.atualizar(this.id()!, dados)
      : this.animaisApi.criar(dados);

    requisicao.subscribe({
      next: (resposta) => {
        const id = resposta.data.id;
        if (this.foto) {
          this.animaisApi.enviarFoto(id, this.foto).subscribe({
            next: () => void this.router.navigate(['/conta/animais']),
            error: (erro) => {
              this.erros.set(mensagensErro(erro));
              this.enviando.set(false);
            },
          });
          return;
        }
        void this.router.navigate(['/conta/animais']);
      },
      error: (erro) => {
        this.erros.set(mensagensErro(erro));
        this.enviando.set(false);
      },
    });
  }

  excluir() {
    const id = this.id();
    if (!id || !confirm('Remover este animal?')) {
      return;
    }
    this.animaisApi.excluir(id).subscribe({
      next: () => void this.router.navigate(['/conta/animais']),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  adicionarVacina() {
    const id = this.id();
    if (!id) {
      return;
    }
    const corpo = new FormData();
    const dados = this.vacinaForm.getRawValue();
    const nome = dados.nome === 'Outra' ? dados.nome_outra.trim() : dados.nome;
    if (!nome) {
      this.erros.set(['Informe o nome da vacina.']);
      return;
    }
    if (!dados.aplicada_em) {
      this.erros.set(['Informe a data da vacina.']);
      return;
    }
    corpo.append('nome', nome);
    corpo.append('aplicada_em', dataIso(dados.aplicada_em));
    if (dados.expira_em) {
      corpo.append('expira_em', dataIso(dados.expira_em));
    }
    if (this.documentoVacina) {
      corpo.append('documento', this.documentoVacina);
    }
    this.animaisApi.adicionarVacina(id, corpo).subscribe({
      next: (resposta) => {
        this.vacinas.update((lista) => [...lista, resposta.data]);
        this.vacinaForm.reset({
          nome: '',
          nome_outra: '',
          aplicada_em: null,
          expira_em: null,
        });
        this.documentoVacina = undefined;
      },
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  excluirVacina(vacina: RegistroVacina) {
    const id = this.id();
    if (!id) {
      return;
    }
    this.animaisApi.excluirVacina(id, vacina.id).subscribe({
      next: () => this.vacinas.update((lista) => lista.filter((item) => item.id !== vacina.id)),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }
}
