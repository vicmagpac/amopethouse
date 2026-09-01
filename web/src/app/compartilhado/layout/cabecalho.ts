import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { filter } from 'rxjs';
import { AutenticacaoService } from '../../nucleo/servicos/autenticacao.service';
import { ambiente } from '../../nucleo/ambiente';

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink, RouterLinkActive, MatIcon],
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.scss',
})
export class Cabecalho {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  protected readonly autenticacao = inject(AutenticacaoService);
  protected readonly whatsapp = `https://wa.me/${ambiente.whatsapp}`;
  protected readonly menuAberto = signal(false);

  protected readonly administrador = computed(
    () => this.autenticacao.usuario()?.papel === 'administrador',
  );
  protected readonly primeiroNome = computed(() => {
    const nome = this.autenticacao.usuario()?.nome?.trim() ?? '';
    return nome.split(/\s+/)[0] || 'Conta';
  });
  protected readonly iniciais = computed(() => {
    const partes = (this.autenticacao.usuario()?.nome ?? '').trim().split(/\s+/).filter(Boolean);
    return partes
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() ?? '')
      .join('');
  });

  constructor() {
    this.router.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuAberto.set(false));
  }

  protected alternarMenu() {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu() {
    this.menuAberto.set(false);
  }

  protected sair() {
    this.fecharMenu();
    this.autenticacao.sair().subscribe();
  }

  @HostListener('document:click', ['$event'])
  protected aoClicarFora(evento: MouseEvent) {
    if (!this.host.nativeElement.contains(evento.target as Node)) {
      this.fecharMenu();
    }
  }
}
