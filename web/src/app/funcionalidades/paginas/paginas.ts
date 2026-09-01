import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagina-institucional',
  template: `
    <article class="pagina">
      <ng-content />
    </article>
  `,
  styles: `
    .pagina {
      max-width: 860px;
      margin: 0 auto;
      padding: 3rem 1.25rem 4rem;
    }
  `,
})
export class PaginaInstitucional {}

@Component({
  selector: 'app-sobre',
  imports: [PaginaInstitucional, RouterLink],
  template: `
    <app-pagina-institucional>
      <h1>Sobre a Amo Pet House</h1>
      <p>Somos um espaço familiar em Papicu, Fortaleza, pensado para cães e gatos se sentirem em casa. Poucos pets por vez, sem gaiolas, com rotina respeitada e cuidado individualizado.</p>
      <p>Apoio de confiança para a sua rotina com o seu pet: hospedagem, creche, visitas em casa, passeios, transporte e acompanhamento veterinário.</p>
      <a class="botao principal" routerLink="/cadastrar">Começar agora</a>
    </app-pagina-institucional>
  `,
})
export class Sobre {}

@Component({
  selector: 'app-servicos',
  imports: [PaginaInstitucional],
  template: `
    <app-pagina-institucional>
      <h1>Serviços</h1>
      <h2>Hospedagem afetiva</h2>
      <p>Cuidado 24h para cães e gatos, com segurança, atenção individual e presença constante.</p>
      <h2>Creche</h2>
      <p>Para tutores que passam o dia fora: supervisão, brincadeira e descanso em turnos de 4h ou 8h.</p>
      <h2>Pet sitter</h2>
      <p>Visitas na sua casa para preservar a rotina, ideal para gatos e pets que preferem ficar no lar.</p>
      <h2>Passeios</h2>
      <p>Caminhadas de 1 hora com foco em movimento, estímulo e gasto de energia.</p>
      <h2>Transporte pet</h2>
      <p>Leva e traz com segurança e conforto.</p>
      <h2>Acompanhamento</h2>
      <p>Apoio em consultas, exames e outros compromissos veterinários.</p>
    </app-pagina-institucional>
  `,
})
export class Servicos {}

@Component({
  selector: 'app-regras',
  imports: [PaginaInstitucional],
  template: `
    <app-pagina-institucional>
      <h1>Regras da estadia</h1>
      <p>Para o bem-estar de todos, pedimos vacinas em dia (antirrábica e demais indicadas para a espécie), informações de rotina alimentar e medicação, e horários combinados de entrada e saída.</p>
      <p>O ambiente é livre, sem gaiolas, com poucos pets por vez. Animais agressivos ou sem histórico vacinal podem ser recusados até avaliação.</p>
    </app-pagina-institucional>
  `,
})
export class Regras {}

@Component({
  selector: 'app-contato',
  imports: [PaginaInstitucional],
  template: `
    <app-pagina-institucional>
      <h1>Contato</h1>
      <p>Papicu — Fortaleza</p>
      <p>Instagram: <a href="https://instagram.com/amopethouse" target="_blank" rel="noopener">@amopethouse</a></p>
      <p>WhatsApp: <a href="https://wa.me/5585992030506" target="_blank" rel="noopener">(85) 99203-0506</a></p>
    </app-pagina-institucional>
  `,
})
export class Contato {}
