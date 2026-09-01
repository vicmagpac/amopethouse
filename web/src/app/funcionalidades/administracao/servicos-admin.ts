import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { forkJoin } from 'rxjs';
import { TipoServico } from '../../nucleo/modelos';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { reais } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-servicos-admin',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggle],
  templateUrl: './servicos-admin.html',
  styleUrl: './servicos-admin.scss',
})
export class ServicosAdmin implements OnInit {
  private readonly api = inject(ReservaService);
  private readonly fb = inject(FormBuilder);

  protected readonly tipos = signal<TipoServico[]>([]);
  protected readonly erros = signal<string[]>([]);
  protected readonly ok = signal('');
  protected readonly reais = reais;
  protected formularios: Record<number, FormGroup> = {};
  protected readonly casa = this.fb.nonNullable.group({
    capacidade_casa: [3, [Validators.required, Validators.min(1), Validators.max(30)]],
  });

  ngOnInit() {
    forkJoin({
      tipos: this.api.tiposAdmin(),
      casa: this.api.configuracaoAdmin(),
    }).subscribe({
      next: ({ tipos, casa }) => {
        this.casa.patchValue({ capacidade_casa: casa.data.capacidade_casa });
        this.tipos.set(tipos.data);
        for (const tipo of tipos.data) {
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

  salvarCasa() {
    this.api.atualizarConfiguracao(this.casa.getRawValue()).subscribe({
      next: (resposta) => {
        this.casa.patchValue(resposta.data);
        this.ok.set(`Capacidade da casa atualizada para ${resposta.data.capacidade_casa} animais.`);
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
