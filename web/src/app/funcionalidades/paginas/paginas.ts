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
  styleUrl: './paginas.scss',
  template: `
    <app-pagina-institucional>
      <h1>Sobre a Amo Pet House</h1>
      <p class="abertura">
        Um espaço familiar em Papicu, Fortaleza, pensado para cães e gatos se sentirem em casa —
        e para você viajar ou passar o dia fora com o coração mais leve.
      </p>

      <article class="cartao">
        <h2>Quem somos</h2>
        <p class="resumo">Cuidado próximo, como em casa. Sem gaiolas e sem superlotação.</p>
        <p>
          A Amo Pet House nasceu do jeito que a gente acredita que um pet deve ser cuidado: com presença,
          calma e respeito à rotina que ele já tem. Não somos um canil nem um depósito de animais.
          Somos um ambiente familiar, com poucos pets por vez, para cada um receber atenção de verdade.
        </p>
        <p>
          Cães e gatos circulam livres, descansam quando precisam e são acompanhados de perto.
          A proposta é simples: confiança para você e bem-estar para o seu pet.
        </p>
      </article>

      <article class="cartao">
        <h2>Como cuidamos</h2>
        <p class="resumo">Rotina respeitada, alimentação do tutor e cuidado individualizado.</p>
        <p>
          Cada animal chega com sua história: horário de comida, medicação, medo de trovão, jeito de dormir.
          A gente pergunta, anota e segue o que funciona na casa de vocês. Não empurramos uma rotina genérica
          para caber todo mundo no mesmo molde.
        </p>
        <ul>
          <li>Poucos pets por vez, para não virar correria</li>
          <li>Ambiente livre, sem gaiolas nem suítes fechadas</li>
          <li>Alimentação e medicação conforme a orientação do tutor</li>
          <li>Cães e gatos, com avaliação de convívio antes da estadia</li>
        </ul>
      </article>

      <article class="cartao">
        <h2>O que oferecemos</h2>
        <p class="resumo">Apoio para a sua rotina: de um dia fora até a viagem inteira.</p>
        <p>
          Hospedagem afetiva, creche em turnos de 4h ou 8h, pet sitter na sua casa, passeios,
          transporte e acompanhamento em consultas. Cada serviço existe para um momento diferente —
          e a gente ajuda a escolher o que cabe no seu caso.
        </p>
        <p>
          Estamos em Papicu, Fortaleza. Eco friendly no jeito de cuidar do espaço e dos animais,
          com o mesmo cuidado que você esperaria de alguém da família.
        </p>
      </article>

      <p class="fechamento">
        Quer conhecer o espaço ou tirar dúvida antes de reservar? Chama no WhatsApp ou cria sua conta
        para cadastrar os dados do seu pet.
      </p>
      <div class="ctas">
        <a class="botao principal" routerLink="/cadastrar">Criar minha conta</a>
        <a class="botao fantasma" routerLink="/servicos">Ver serviços</a>
        <a class="botao fantasma" [href]="whatsapp" target="_blank" rel="noopener">WhatsApp {{ whatsappRotulo }}</a>
      </div>
    </app-pagina-institucional>
  `,
})
export class Sobre {
  protected readonly whatsapp = `https://wa.me/${ambiente.whatsapp}`;
  protected readonly whatsappRotulo = ambiente.whatsappRotulo;
}

@Component({
  selector: 'app-servicos',
  imports: [PaginaInstitucional, RouterLink],
  styleUrl: './paginas.scss',
  template: `
    <app-pagina-institucional>
      <h1>Serviços</h1>
      <p class="abertura">
        Cuidado próximo em Papicu, Fortaleza: poucos pets por vez, sem gaiolas, com rotina respeitada.
        Escolha o serviço que combina com o dia do seu cão ou gato.
      </p>

      <article class="cartao">
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

      <article class="cartao">
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

      <article class="cartao">
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

      <article class="cartao">
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

      <article class="cartao">
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

      <article class="cartao">
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
})
export class Servicos {
  protected readonly whatsapp = `https://wa.me/${ambiente.whatsapp}`;
  protected readonly whatsappRotulo = ambiente.whatsappRotulo;
}

@Component({
  selector: 'app-regras',
  imports: [PaginaInstitucional, RouterLink],
  styleUrl: './paginas.scss',
  template: `
    <app-pagina-institucional>
      <h1>Regras da estadia</h1>
      <p class="abertura">
        As regras existem para o seu pet, para os outros animais e para quem cuida.
        Combinamos tudo com transparência antes da primeira reserva.
      </p>

      <article class="cartao">
        <h2>Vacinas e saúde</h2>
        <p class="resumo">Vacinas em dia são condição para o convívio no espaço.</p>
        <p>
          Pedimos antirrábica e as demais vacinas indicadas para a espécie, além de vermífugo e
          controle de pulgas e carrapatos em dia. Sem comprovação, a reserva pode ser recusada
          até uma avaliação. Pets doentes, com vômito, diarreia ou suspeita de doença contagiosa
          não devem vir até o veterinário liberar.
        </p>
        <ul>
          <li>Carteira de vacinação atualizada (foto ou original)</li>
          <li>Informar alergias, medicação e restrições alimentares</li>
          <li>Avisar cio, cirurgia recente ou qualquer alteração de saúde</li>
        </ul>
      </article>

      <article class="cartao">
        <h2>Rotina, comida e medicação</h2>
        <p class="resumo">Você nos conta o que o pet já faz em casa. A gente segue.</p>
        <p>
          Traga a ração ou a comida que ele já come, na quantidade do período, e explique horários.
          Medicamentos vêm identificados, com dose e horário. Não substituímos conduta veterinária
          e não improvisamos dieta sem o seu combinado.
        </p>
        <ul>
          <li>Alimentação fornecida pelo tutor, sempre que possível</li>
          <li>Medicação somente com orientação clara por escrito</li>
          <li>Objetos de apego (caminha, brinquedo, fucinho) são bem-vindos</li>
        </ul>
      </article>

      <article class="cartao">
        <h2>Convívio e comportamento</h2>
        <p class="resumo">O espaço é livre, com poucos pets. Nem todo animal se encaixa nesse modelo.</p>
        <p>
          Não usamos gaiolas. Por isso avaliamos se o pet convive bem com outros, se aceita manejo
          e se o temperamento permite um ambiente compartilhado. Animais agressivos com pessoas ou
          com outros pets podem ser recusados, ou encaminhados para pet sitter em casa,
          que costuma ser mais seguro para eles.
        </p>
        <ul>
          <li>Poucos animais por vez, para reduzir estresse</li>
          <li>Coleira e guia em bom estado, no caso de cães</li>
          <li>Gatos: caixa de transporte para o deslocamento</li>
          <li>Histórico de mordida ou briga precisa ser dito na conversa prévia</li>
        </ul>
      </article>

      <article class="cartao">
        <h2>Horários, reserva e pagamento</h2>
        <p class="resumo">Entrada e saída combinadas. Reserva pelo site; cobrança no checkout presencial.</p>
        <p>
          A reserva é confirmada depois da conversa e dos dados do pet na sua conta.
          O pagamento deste recorte é feito no local, na entrada ou na saída, conforme combinado —
          não há cobrança online por enquanto. Atrasos sem aviso atrapalham o ritmo dos outros pets;
          avise se o horário mudar.
        </p>
        <ul>
          <li>Horário de chegada e busca definidos na reserva</li>
          <li>Cancelamento: avise com a antecedência combinada no WhatsApp</li>
          <li>Valores e formas de pagamento são alinhados antes do dia</li>
        </ul>
      </article>

      <p class="fechamento">
        Em caso de dúvida, fale com a gente antes de agendar. É melhor combinar cedo do que
        descobrir no dia que o serviço não cabe para aquele pet.
      </p>
      <div class="ctas">
        <a class="botao principal" routerLink="/cadastrar">Criar minha conta</a>
        <a class="botao fantasma" [href]="whatsapp" target="_blank" rel="noopener">WhatsApp {{ whatsappRotulo }}</a>
      </div>
    </app-pagina-institucional>
  `,
})
export class Regras {
  protected readonly whatsapp = `https://wa.me/${ambiente.whatsapp}`;
  protected readonly whatsappRotulo = ambiente.whatsappRotulo;
}

@Component({
  selector: 'app-contato',
  imports: [PaginaInstitucional, RouterLink],
  styleUrl: './paginas.scss',
  template: `
    <app-pagina-institucional>
      <h1>Contato</h1>
      <p class="abertura">
        Fale direto com a Amo Pet House. WhatsApp é o caminho mais rápido para tirar dúvida,
        pedir valor ou combinar uma visita em Papicu.
      </p>

      <article class="cartao">
        <h2>WhatsApp</h2>
        <p class="resumo">O jeito mais simples de combinar um cuidado.</p>
        <p>
          Mande uma mensagem com o nome do pet, a espécie e o que você precisa
          (hospedagem, creche, passeio, transporte ou visita em casa). Respondemos por lá
          com disponibilidade, valores e o que precisamos saber antes da reserva.
        </p>
        <p>
          <a [href]="whatsapp" target="_blank" rel="noopener">{{ whatsappRotulo }}</a>
        </p>
      </article>

      <article class="cartao">
        <h2>Instagram</h2>
        <p class="resumo">Bastidores, rotina e o dia a dia com os pets.</p>
        <p>
          Acompanhe avisos, fotos do espaço e novidades. Para reserva e dúvidas objetivas,
          o WhatsApp continua sendo o canal principal.
        </p>
        <p>
          <a [href]="instagram" target="_blank" rel="noopener">{{ instagramRotulo }}</a>
        </p>
      </article>

      <article class="cartao">
        <h2>Onde estamos</h2>
        <p class="resumo">Papicu — Fortaleza, Ceará.</p>
        <p>
          Atendemos tutores da região e de Fortaleza que precisam de um cuidado próximo,
          sem pet shop lotado. O endereço exato e o melhor horário para conhecer o espaço
          combinamos no WhatsApp, para receber você com calma e sem atropelo na rotina dos pets.
        </p>
        <ul>
          <li>Bairro: Papicu, Fortaleza</li>
          <li>Cães e gatos, com avaliação prévia</li>
          <li>Visita ao espaço mediante combinado</li>
        </ul>
      </article>

      <article class="cartao">
        <h2>Como começar</h2>
        <p class="resumo">Crie sua conta, cadastre o pet e fale com a gente.</p>
        <p>
          Com a conta pronta, você registra vacinas, temperamento e a rotina do animal.
          Isso agiliza a conversa e deixa a estadia mais segura para todo mundo.
        </p>
      </article>

      <p class="fechamento">
        Prefere se apresentar pelo site? Crie a conta e depois chama no WhatsApp citando o nome do pet.
      </p>
      <div class="ctas">
        <a class="botao principal" [href]="whatsapp" target="_blank" rel="noopener">Chamar no WhatsApp</a>
        <a class="botao fantasma" routerLink="/cadastrar">Criar minha conta</a>
      </div>
    </app-pagina-institucional>
  `,
})
export class Contato {
  protected readonly whatsapp = `https://wa.me/${ambiente.whatsapp}`;
  protected readonly whatsappRotulo = ambiente.whatsappRotulo;
  protected readonly instagram = ambiente.instagram;
  protected readonly instagramRotulo = ambiente.instagramRotulo;
}
