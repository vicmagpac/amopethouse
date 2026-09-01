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
  protected readonly whatsappRotulo = ambiente.whatsappRotulo;
  protected readonly instagram = ambiente.instagram;
  protected readonly instagramRotulo = ambiente.instagramRotulo;
  protected readonly local = ambiente.local;

  protected readonly diferenciais = [
    { titulo: 'Espaço seguro e tranquilo', texto: 'Um ambiente calmo para o pet se sentir protegido.' },
    { titulo: 'Seu pet livre, sem gaiolas', texto: 'Hospedagem afetiva, com liberdade para circular.' },
    { titulo: 'Ambiente familiar', texto: 'Cuidado próximo, como em casa.' },
    { titulo: 'Poucos pets por vez', texto: 'Atenção de verdade, sem superlotação.' },
    { titulo: 'Cuidado individualizado', texto: 'Cada animal com sua rotina e necessidades.' },
    { titulo: 'Rotina respeitada', texto: 'Alimentação, descanso e hábitos do seu pet.' },
  ];

  protected readonly servicos = [
    {
      titulo: 'Hospedagem afetiva',
      texto: 'Cuidado 24h para cães e gatos, com segurança, atenção individual e presença constante.',
    },
    {
      titulo: 'Creche',
      texto: 'Ideal para quem passa o dia fora: supervisão, brincadeira e descanso em turnos de 4h ou 8h.',
    },
    {
      titulo: 'Pet sitter',
      texto: 'Visitas na sua casa para preservar a rotina. Indicado para gatos e pets que preferem ficar no lar.',
    },
    {
      titulo: 'Passeios',
      texto: 'Caminhadas de 1 hora com foco em movimento, estímulo e gasto de energia.',
    },
    {
      titulo: 'Transporte pet',
      texto: 'Leva e traz com segurança e conforto, para o hotel, a creche ou o veterinário.',
    },
    {
      titulo: 'Acompanhamento',
      texto: 'Apoio em consultas, exames e outros compromissos veterinários.',
    },
  ];
}
