import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './cabecalho';
import { Rodape } from './rodape';

@Component({
  selector: 'app-casca-publica',
  imports: [RouterOutlet, Cabecalho, Rodape],
  template: `
    <app-cabecalho />
    <main class="conteudo">
      <router-outlet />
    </main>
    <app-rodape />
  `,
  styles: `
    .conteudo {
      min-height: calc(100vh - 220px);
    }
  `,
})
export class CascaPublica {}
