import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ambiente } from '../../nucleo/ambiente';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  protected readonly whatsapp = `https://wa.me/${ambiente.whatsapp}`;

  protected readonly diferenciais = [
    'Espaço seguro e tranquilo',
    'Seu pet livre, sem gaiolas',
    'Ambiente familiar',
    'Poucos pets por vez',
    'Cuidado individualizado',
    'Rotina respeitada',
  ];

  protected readonly servicos = [
    { titulo: 'Hospedagem afetiva', texto: 'Cuidado 24h para cães e gatos, com atenção individual e presença constante.' },
    { titulo: 'Creche', texto: 'Ideal para quem passa o dia fora. Turnos de 4h ou 8h, com supervisão, brincadeira e descanso.' },
    { titulo: 'Pet sitter', texto: 'Visitas em casa para preservar a rotina, especialmente para gatos e pets que preferem ficar no lar.' },
    { titulo: 'Passeios', texto: 'Caminhadas de 1h com foco em movimento, estímulo e gasto de energia.' },
    { titulo: 'Transporte pet', texto: 'Deslocamento seguro e confortável para o seu animal.' },
    { titulo: 'Acompanhamento', texto: 'Apoio em consultas, exames e outros compromissos veterinários.' },
  ];
}
