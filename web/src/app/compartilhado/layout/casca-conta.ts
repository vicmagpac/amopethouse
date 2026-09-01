import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { Cabecalho } from './cabecalho';
import { Rodape } from './rodape';

@Component({
  selector: 'app-casca-conta',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Cabecalho, Rodape],
  template: `
    <app-cabecalho />
    <section class="conta">
      <aside>
        <p>Olá, {{ autenticacao.usuario()?.nome }}</p>
        <a routerLink="/conta/animais" routerLinkActive="ativo">Meus animais</a>
        <a routerLink="/conta/perfil" routerLinkActive="ativo">Meu perfil</a>
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
      grid-template-columns: 240px 1fr;
      min-height: calc(100vh - 220px);
    }
    aside {
      background: #c1c9b7;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    aside p {
      font-weight: 700;
      color: #4a6741;
    }
    aside a {
      color: #2f432c;
      font-weight: 600;
    }
    aside a.ativo {
      color: #4a6741;
      text-decoration: underline;
    }
    .painel {
      padding: 1.5rem;
    }
    @media (max-width: 800px) {
      .conta {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class CascaConta {
  protected readonly autenticacao = inject(AutenticacaoService);
}
