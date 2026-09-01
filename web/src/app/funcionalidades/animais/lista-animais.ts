import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { AnimalService } from '../../nucleo/servicos/animal.service';
import { Animal } from '../../nucleo/modelos';
import { mensagensErro } from '../../compartilhado/util/mensagens-erro';

@Component({
  selector: 'app-lista-animais',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatChipsModule, MatIcon, MatProgressSpinner],
  template: `
    <div class="topo">
      <div>
        <h1>Meus animais</h1>
        <p class="subtitulo">Cadastre cães e gatos para agilizar reservas, vacinas e o cuidado na Amo Pet House.</p>
      </div>
      <a matButton="filled" routerLink="/conta/animais/novo">
        <mat-icon>add</mat-icon>
        Adicionar animal
      </a>
    </div>

    @if (erros().length) {
      <ul class="erros">@for (erro of erros(); track erro) { <li>{{ erro }}</li> }</ul>
    }

    @if (carregando()) {
      <div class="carregando">
        <mat-progress-spinner diameter="36" mode="indeterminate" />
      </div>
    } @else if (animais().length === 0) {
      <mat-card class="vazio" appearance="outlined">
        <mat-card-content>
          <div class="icone-vazio">
            <mat-icon>pets</mat-icon>
          </div>
          <h2>Nenhum pet por aqui ainda</h2>
          <p>Adicione o primeiro animal com raça, temperamento e vacinas. Isso deixa a reserva mais segura e rápida.</p>
          <a matButton="filled" routerLink="/conta/animais/novo">
            <mat-icon>add</mat-icon>
            Cadastrar meu pet
          </a>
        </mat-card-content>
      </mat-card>
    } @else {
      <div class="grade">
        @for (animal of animais(); track animal.id) {
          <mat-card class="cartao-pet" appearance="outlined">
            <div class="foto" [class.sem-foto]="!animal.foto_url">
              @if (animal.foto_url) {
                <img [src]="animal.foto_url" [alt]="animal.nome" />
              } @else {
                <mat-icon>{{ animal.especie === 'gato' ? 'cruelty_free' : 'pets' }}</mat-icon>
              }
            </div>
            <mat-card-header>
              <mat-card-title>{{ animal.nome }}</mat-card-title>
              <mat-card-subtitle>{{ animal.raca || animal.especie_rotulo }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <mat-chip-set>
                <mat-chip>{{ animal.especie_rotulo }}</mat-chip>
                <mat-chip>{{ animal.porte_rotulo }}</mat-chip>
                <mat-chip>{{ animal.sexo_rotulo }}</mat-chip>
              </mat-chip-set>
            </mat-card-content>
            <mat-card-actions>
              <a matButton [routerLink]="['/conta/animais', animal.id]">
                <mat-icon>edit</mat-icon>
                Editar
              </a>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    }
  `,
  styles: `
    .topo {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
    }
    h1 {
      margin: 0 0 0.35rem;
    }
    .subtitulo {
      margin: 0;
      max-width: 36rem;
      color: #5b6f55;
      line-height: 1.45;
    }
    .carregando {
      display: grid;
      place-items: center;
      min-height: 220px;
    }
    .vazio {
      text-align: center;
      padding: 1.5rem 1rem 2rem;
    }
    .vazio h2 {
      margin: 0.5rem 0 0.4rem;
    }
    .vazio p {
      max-width: 28rem;
      margin: 0 auto 1.25rem;
      color: #5b6f55;
      line-height: 1.5;
    }
    .icone-vazio {
      width: 72px;
      height: 72px;
      margin: 0.5rem auto;
      border-radius: 50%;
      background: rgb(74 103 65 / 10%);
      display: grid;
      place-items: center;
    }
    .icone-vazio mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: var(--verde);
    }
    .grade {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.1rem;
    }
    .cartao-pet {
      overflow: hidden;
    }
    .foto {
      height: 180px;
      background: #e8eee3;
      display: grid;
      place-items: center;
    }
    .foto img {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }
    .foto.sem-foto mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--verde);
    }
    mat-card-title {
      color: var(--verde);
    }
  `,
})
export class ListaAnimais implements OnInit {
  private readonly animaisApi = inject(AnimalService);
  protected readonly animais = signal<Animal[]>([]);
  protected readonly erros = signal<string[]>([]);
  protected readonly carregando = signal(true);

  ngOnInit() {
    this.animaisApi
      .listar()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (resposta) => this.animais.set(resposta.data),
        error: (erro) => this.erros.set(mensagensErro(erro)),
      });
  }
}
