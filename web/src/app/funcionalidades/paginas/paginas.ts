import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ambiente } from '../../nucleo/ambiente';

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
  imports: [PaginaInstitucional, RouterLink],
  template: `
    <app-pagina-institucional>
      <h1>Serviços</h1>
      <p class="abertura">
        Cuidado próximo em Papicu, Fortaleza: poucos pets por vez, sem gaiolas, com rotina respeitada.
        Escolha o serviço que combina com o dia do seu cão ou gato.
      </p>

      <article class="servico">
        <h2>Hospedagem afetiva</h2>
        <p class="resumo">Cuidado 24h para cães e gatos, com segurança, atenção individual e presença constante.</p>
        <p>
          Quando você viaja ou precisa ficar fora de casa por um ou mais dias, seu pet fica em um espaço familiar,
          livre para circular, descansar e receber carinho. Não usamos gaiolas nem suítes fechadas: o ambiente é
          compartilhado com poucos animais por vez, para cada um ser visto de verdade.
        </p>
        <p>
          Seguimos a rotina que você já tem em casa: horários de alimentação, medicação, passeio e sono.
          Você recebe informações sobre como o pet está passando o período.
        </p>
        <ul>
          <li>Estadia diurna e noturna, com supervisão contínua</li>
          <li>Alimentação e medicação conforme a orientação do tutor</li>
          <li>Ambiente calmo, sem superlotação</li>
          <li>Indicado para cães e gatos socializados com o convívio</li>
        </ul>
      </article>

      <article class="servico">
        <h2>Creche</h2>
        <p class="resumo">Para quem passa o dia fora: supervisão, brincadeira e descanso em turnos de 4h ou 8h.</p>
        <p>
          A creche é o meio-termo entre deixar o pet sozinho em casa e uma hospedagem completa.
          Durante o expediente, o animal tem companhia, movimento e pausas para descanso, em um ritmo que
          respeita o temperamento dele — nem todo mundo quer brincar o tempo inteiro.
        </p>
        <p>
          Os turnos de 4 horas cabem em compromissos mais curtos. Os de 8 horas cobrem o dia de trabalho.
          Combinamos chegada, saída e o que o pet pode ou não fazer com outros animais.
        </p>
        <ul>
          <li>Turnos de 4h ou 8h, com horário combinado</li>
          <li>Supervisão, brincadeira e momentos de calma</li>
          <li>Alimentação no período, se fizer parte da rotina</li>
          <li>Ideal para tutores que trabalham fora ou têm agenda cheia</li>
        </ul>
      </article>

      <article class="servico">
        <h2>Pet sitter</h2>
        <p class="resumo">Visitas na sua casa para preservar a rotina. Indicado para gatos e pets que preferem ficar no lar.</p>
        <p>
          Nem todo animal se adapta a sair de casa. Gatos, pets idosos, ansiosos ou muito apegados ao território
          costumam ficar mais tranquilos no próprio ambiente. O pet sitter vai até você: alimenta, troca água,
          limpa caixinha ou área de necessidades, dá atenção e confere se está tudo bem.
        </p>
        <p>
          A visita segue o que o pet já conhece — cômodos, brinquedos, horários — e reduz o estresse de transporte
          ou de um lugar novo. Combinamos a quantidade de visitas por dia de acordo com a necessidade.
        </p>
        <ul>
          <li>Visitas no endereço do tutor, em Papicu e região combinada</li>
          <li>Alimentação, água, higiene e companhia</li>
          <li>Bom para gatos e cães que não se dão bem fora de casa</li>
          <li>Relato do que aconteceu em cada visita</li>
        </ul>
      </article>

      <article class="servico">
        <h2>Passeios</h2>
        <p class="resumo">Caminhadas de 1 hora com foco em movimento, estímulo e gasto de energia.</p>
        <p>
          Um passeio bem feito não é só “dar uma volta na quadra”. São cerca de 60 minutos para o cão cheirar,
          se movimentar e aliviar a energia acumulada, com guia segura e respeito ao ritmo dele.
          Ajuda quem trabalha o dia todo, tem mobilidade reduzida ou simplesmente quer um reforço na rotina.
        </p>
        <p>
          Combinamos o ponto de encontro, o percurso usual do pet e qualquer cuidado especial
          (outros cães, barulho, puxões, medo de moto). Gatos, em regra, não entram neste serviço.
        </p>
        <ul>
          <li>Duração de 1 hora por passeio</li>
          <li>Foco em exercício, cheiro e bem-estar, não em treino pesado</li>
          <li>Coleira e guia adequadas; o tutor informa o comportamento</li>
          <li>Horários combinados na semana, conforme a agenda</li>
        </ul>
      </article>

      <article class="servico">
        <h2>Transporte pet</h2>
        <p class="resumo">Leva e traz com segurança e conforto, para o hotel, a creche ou o veterinário.</p>
        <p>
          Deslocar um animal com pressa, em carro inadequado ou sem contenção gera medo e risco.
          O transporte pet é o leva e traz combinado: da sua casa até a Amo Pet House, o veterinário
          ou outro destino combinado, com o pet acomodado e o trajeto feito com calma.
        </p>
        <p>
          Pode ser avulso (uma consulta, um banho, uma hospedagem) ou encaixado na creche e na estadia.
          Você informa caixa de transporte, cinto, enjoo e o que deixa o pet mais seguro.
        </p>
        <ul>
          <li>Busca e entrega em endereço combinado</li>
          <li>Trajeto para hospedagem, creche ou clínica</li>
          <li>Acomodação adequada ao porte e à espécie</li>
          <li>Combinado de horário de ida e volta</li>
        </ul>
      </article>

      <article class="servico">
        <h2>Acompanhamento</h2>
        <p class="resumo">Apoio em consultas, exames e outros compromissos veterinários.</p>
        <p>
          Tem dia em que você não consegue ir à clínica, ou prefere alguém de confiança ao lado do pet
          na espera, na consulta e no exame. O acompanhamento é essa presença: levar, ficar, anotar
          o que o veterinário falou e devolver o animal em casa com as orientações claras.
        </p>
        <p>
          Ajuda em retornos, vacina, coleta de exame e avaliações em que o pet precisa de calma.
          Não substitui decisão médica: a conduta é sempre a do profissional de saúde responsável.
        </p>
        <ul>
          <li>Presença na consulta, exame ou procedimento combinado</li>
          <li>Transporte até a clínica, quando fizer parte do combinado</li>
          <li>Registro das orientações para o tutor</li>
          <li>Indicado quando você não pode ir ou o pet fica muito nervoso sozinho</li>
        </ul>
      </article>

      <p class="fechamento">
        Vacinas em dia, informações de alimentação e uma conversa prévia nos ajudam a aceitar cada reserva
        com segurança. Se tiver dúvida sobre qual serviço cabe no seu caso, fale com a gente.
      </p>
      <div class="ctas">
        <a class="botao principal" routerLink="/cadastrar">Criar minha conta</a>
        <a class="botao fantasma" [href]="whatsapp" target="_blank" rel="noopener">WhatsApp {{ whatsappRotulo }}</a>
      </div>
    </app-pagina-institucional>
  `,
  styles: `
    .abertura,
    .fechamento {
      font-size: 1.05rem;
      line-height: 1.55;
    }
    .servico {
      background: #fff;
      border-radius: 18px;
      padding: 1.35rem 1.4rem 1.2rem;
      margin: 1.4rem 0;
      box-shadow: 0 10px 30px rgb(74 103 65 / 8%);
    }
    .servico h2 {
      margin: 0 0 0.4rem;
    }
    .resumo {
      color: var(--verde);
      font-weight: 700;
      margin: 0 0 0.85rem;
    }
    .servico p,
    .servico li {
      line-height: 1.55;
    }
    .servico ul {
      margin: 0.4rem 0 0;
      padding-left: 1.15rem;
    }
    .servico li {
      margin-bottom: 0.35rem;
    }
    .ctas {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
  `,
})
export class Servicos {
  protected readonly whatsapp = `https://wa.me/${ambiente.whatsapp}`;
  protected readonly whatsappRotulo = ambiente.whatsappRotulo;
}

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
