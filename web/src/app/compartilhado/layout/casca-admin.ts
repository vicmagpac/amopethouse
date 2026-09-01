import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';

@Component({
  selector: 'app-casca-admin',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatToolbar,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatIcon,
    MatIconButton,
    MatButton,
  ],
  template: `
    <mat-sidenav-container class="admin">
      <mat-sidenav #menu mode="side" [opened]="aberto()" class="barra">
        <div class="marca">
          <img src="/brand/logo.jpg" alt="Amo Pet House" />
          <div>
            <strong>Amo Pet House</strong>
            <span>Painel da equipe</span>
          </div>
        </div>

        <p class="grupo">Principal</p>
        <mat-nav-list>
          <a mat-list-item routerLink="/admin" routerLinkActive="ativo" [routerLinkActiveOptions]="{ exact: true }">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
        </mat-nav-list>

        <p class="grupo">Operação</p>
        <mat-nav-list>
          <a mat-list-item routerLink="/admin/reservas" routerLinkActive="ativo">
            <mat-icon matListItemIcon>event_available</mat-icon>
            <span matListItemTitle>Reservas</span>
          </a>
          <a mat-list-item routerLink="/admin/bloqueios" routerLinkActive="ativo">
            <mat-icon matListItemIcon>event_busy</mat-icon>
            <span matListItemTitle>Bloqueios</span>
          </a>
        </mat-nav-list>

        <p class="grupo">Catálogo</p>
        <mat-nav-list>
          <a mat-list-item routerLink="/admin/servicos" routerLinkActive="ativo">
            <mat-icon matListItemIcon>spa</mat-icon>
            <span matListItemTitle>Serviços e preços</span>
          </a>
        </mat-nav-list>

        <div class="rodape-menu">
          <p>{{ autenticacao.usuario()?.nome }}</p>
          <a routerLink="/">Ver o site</a>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="topo">
          <button matIconButton type="button" (click)="aberto.set(!aberto())" aria-label="Abrir menu">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="titulo">Administração</span>
          <span class="espaco"></span>
          <button matButton="text" type="button" (click)="autenticacao.sair().subscribe()">
            <mat-icon>logout</mat-icon>
            Sair
          </button>
        </mat-toolbar>
        <div class="conteudo">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .admin {
      height: 100vh;
      background: #e8eee4;
    }
    .barra {
      width: 268px;
      background: #1c2b1f;
      color: #e8eee4;
      border: 0;
    }
    .marca {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      padding: 1.1rem 1rem 1.25rem;
    }
    .marca img {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      object-fit: cover;
    }
    .marca strong {
      display: block;
      font-size: 0.95rem;
    }
    .marca span {
      font-size: 0.75rem;
      opacity: 0.7;
    }
    .grupo {
      margin: 1rem 1rem 0.2rem;
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.45;
    }
    .barra a {
      color: #dce6d7;
      border-radius: 0;
    }
    .barra a.ativo {
      background: rgb(229 169 180 / 18%);
      box-shadow: inset 3px 0 0 var(--rosa);
    }
    .barra mat-icon {
      color: #e5a9b4;
    }
    .rodape-menu {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      font-size: 0.85rem;
    }
    .rodape-menu p {
      margin: 0 0 0.25rem;
      font-weight: 700;
    }
    .rodape-menu a {
      color: #e5a9b4;
    }
    .topo {
      background: #fff;
      color: var(--texto);
      box-shadow: 0 1px 0 rgb(0 0 0 / 6%);
    }
    .titulo {
      font-weight: 800;
      color: var(--verde);
    }
    .espaco {
      flex: 1;
    }
    .conteudo {
      padding: 1.25rem;
      min-height: calc(100vh - 64px);
    }
  `,
})
export class CascaAdmin {
  protected readonly autenticacao = inject(AutenticacaoService);
  protected readonly aberto = signal(true);
}
