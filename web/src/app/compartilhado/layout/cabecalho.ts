import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { ambiente } from '../../nucleo/ambiente';

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.scss',
})
export class Cabecalho {
  protected readonly autenticacao = inject(AutenticacaoService);
  protected readonly whatsapp = `https://wa.me/${ambiente.whatsapp}`;
}
