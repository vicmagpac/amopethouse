import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnimalService } from '../../nucleo/servicos/animal.service';
import { Animal, RegistroVacina } from '../../nucleo/modelos';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-formulario-animal',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-animal.html',
  styles: `
    img.preview { width: 160px; height: 160px; object-fit: cover; border-radius: 16px; }
    .vacinas { margin-top: 2rem; }
  `,
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

  protected readonly formulario = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    especie: ['cao', Validators.required],
    raca: [''],
    porte: ['pequeno', Validators.required],
    sexo: ['macho', Validators.required],
    data_nascimento: [''],
    peso: [''],
    castrado: [false],
    temperamento: [''],
    observacoes: [''],
  });

  protected readonly vacinaForm = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    aplicada_em: ['', Validators.required],
    expira_em: [''],
  });

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
        this.formulario.patchValue({
          nome: resposta.data.nome,
          especie: resposta.data.especie,
          raca: resposta.data.raca ?? '',
          porte: resposta.data.porte,
          sexo: resposta.data.sexo,
          data_nascimento: resposta.data.data_nascimento ?? '',
          peso: String(resposta.data.peso ?? ''),
          castrado: resposta.data.castrado,
          temperamento: resposta.data.temperamento ?? '',
          observacoes: resposta.data.observacoes ?? '',
        });
      },
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }

  aoSelecionarFoto(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.foto = input.files?.[0];
  }

  salvar() {
    this.erros.set([]);
    this.enviando.set(true);
    const bruto = this.formulario.getRawValue();
    const dados: Record<string, unknown> = {
      ...bruto,
      peso: bruto.peso ? Number(bruto.peso) : null,
      data_nascimento: bruto.data_nascimento || null,
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
    corpo.append('nome', dados.nome);
    corpo.append('aplicada_em', dados.aplicada_em);
    if (dados.expira_em) {
      corpo.append('expira_em', dados.expira_em);
    }
    this.animaisApi.adicionarVacina(id, corpo).subscribe({
      next: (resposta) => {
        this.vacinas.update((lista) => [...lista, resposta.data]);
        this.vacinaForm.reset();
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
