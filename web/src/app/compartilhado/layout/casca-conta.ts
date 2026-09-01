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
  template: `
    <app-cabecalho />
    <section class="conta">
      <aside class="menu-conta">
        <div class="saudacao">
          <div class="avatar" aria-hidden="true">{{ iniciais() }}</div>
          <div>
            <p class="ola">Olá</p>
            <p class="nome">{{ autenticacao.usuario()?.nome }}</p>
          </div>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/conta/reservas" routerLinkActive="ativo">
            <mat-icon matListItemIcon>event</mat-icon>
            <span matListItemTitle>Minhas reservas</span>
          </a>
          <a mat-list-item routerLink="/conta/animais" routerLinkActive="ativo">
            <mat-icon matListItemIcon>pets</mat-icon>
            <span matListItemTitle>Meus animais</span>
          </a>
          <a mat-list-item routerLink="/conta/perfil" routerLinkActive="ativo">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>Meu perfil</span>
          </a>
        </mat-nav-list>
      </aside>
      <div class="painel">
        <router-outlet />
      </div>
    </section>
    <app-rodape />
  `,
  styles: `
    .conta {
      display: grid;
      grid-template-columns: 280px minmax(0, 1fr);
      gap: 1.5rem;
      max-width: 1180px;
      margin: 1.5rem auto 2.5rem;
      padding: 0 1.25rem;
      min-height: calc(100vh - 240px);
      align-items: start;
    }
    .menu-conta {
      background: #fff;
      border-radius: 20px;
      padding: 1.25rem 0.75rem 0.75rem;
      box-shadow: 0 10px 30px rgb(74 103 65 / 8%);
      position: sticky;
      top: 6.5rem;
    }
    .saudacao {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.35rem 0.75rem 1.1rem;
    }
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--verde);
      color: #fff;
      display: grid;
      place-items: center;
      font-weight: 800;
      flex-shrink: 0;
    }
    .ola {
      margin: 0;
      font-size: 0.8rem;
      color: #5b6f55;
      font-weight: 600;
    }
    .nome {
      margin: 0.1rem 0 0;
      font-weight: 800;
      color: var(--verde);
      line-height: 1.2;
    }
    a.ativo {
      background: rgb(74 103 65 / 10%);
      border-radius: 12px;
    }
    .painel {
      min-width: 0;
    }
    @media (max-width: 800px) {
      .conta {
        grid-template-columns: 1fr;
        margin-top: 1rem;
      }
      .menu-conta {
        position: static;
      }
    }
  `,
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
