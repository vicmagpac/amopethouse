import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimalService } from '../../nucleo/servicos/animal.service';
import { Animal } from '../../nucleo/modelos';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-lista-animais',
  imports: [RouterLink],
  template: `
    <div class="topo-lista">
      <h1>Meus animais</h1>
      <a class="botao principal" routerLink="/conta/animais/novo">Adicionar animal</a>
    </div>
    @if (erros().length) {
      <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
    }
    @if (animais().length === 0) {
      <p>Você ainda não cadastrou nenhum animal.</p>
    }
    <div class="grade">
      @for (animal of animais(); track animal.id) {
        <article class="cartao">
          @if (animal.foto_url) {
            <img [src]="animal.foto_url" [alt]="animal.nome" />
          }
          <h3>{{ animal.nome }}</h3>
          <p>{{ animal.especie_rotulo }} · {{ animal.porte_rotulo }} · {{ animal.sexo_rotulo }}</p>
          <a class="botao fantasma" [routerLink]="['/conta/animais', animal.id]">Editar</a>
        </article>
      }
    </div>
  `,
  styles: `
    .topo-lista { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
    img { width: 100%; height: 160px; object-fit: cover; border-radius: 12px; }
    .grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; margin-top: 1rem; }
  `,
})
export class ListaAnimais implements OnInit {
  private readonly animaisApi = inject(AnimalService);
  protected readonly animais = signal<Animal[]>([]);
  protected readonly erros = signal<string[]>([]);

  ngOnInit() {
    this.animaisApi.listar().subscribe({
      next: (resposta) => this.animais.set(resposta.data),
      error: (erro) => this.erros.set(mensagensErro(erro)),
    });
  }
}
