import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BloqueioEquipe, TipoServico } from '../../nucleo/modelos';
import { ReservaService } from '../../nucleo/servicos/reserva.service';
import { dataHora, dataIso } from '../../compartilhado/util/formatacao';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-bloqueios-admin',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './bloqueios-admin.html',
  styleUrl: './bloqueios-admin.scss',
})
export class BloqueiosAdmin implements OnInit {
  private readonly api = inject(ReservaService);
  private readonly fb = inject(FormBuilder);

  protected readonly tipos = signal<TipoServico[]>([]);
  protected readonly bloqueios = signal<BloqueioEquipe[]>([]);
  protected readonly erros = signal<string[]>([]);
  protected readonly dataHora = dataHora;
  protected readonly formulario = this.fb.group({
    tipo_servico_id: ['' as string | number],
    inicio: [null as Date | null, Validators.required],
    fim: [null as Date | null, Validators.required],
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
    if (!dados.inicio || !dados.fim) {
      return;
    }
    this.api
      .criarBloqueio({
        tipo_servico_id: dados.tipo_servico_id === '' ? null : dados.tipo_servico_id,
        inicio: `${dataIso(dados.inicio)}T00:00:00`,
        fim: `${dataIso(dados.fim)}T23:59:59`,
        motivo: dados.motivo || null,
      })
      .subscribe({
        next: () => {
          this.formulario.reset({ tipo_servico_id: '', inicio: null, fim: null, motivo: '' });
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
