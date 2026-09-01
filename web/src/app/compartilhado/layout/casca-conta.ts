import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { Cabecalho } from './cabecalho';
import { Rodape } from './rodape';

@Component({
  selector: 'app-casca-conta',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Cabecalho,
    Rodape,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatIcon,
  ],
  templateUrl: './casca-conta.html',
  styleUrl: './casca-conta.scss',
})
export class CascaConta {
  protected readonly autenticacao = inject(AutenticacaoService);
  protected readonly iniciais = computed(() => {
    const partes = (this.autenticacao.usuario()?.nome ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return partes
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() ?? '')
      .join('');
  });
}
