import { Component } from '@angular/core';
import { ambiente } from '../../nucleo/ambiente';

@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.html',
  styleUrl: './rodape.scss',
})
export class Rodape {
  protected readonly local = ambiente.local;
  protected readonly instagram = ambiente.instagram;
  protected readonly instagramRotulo = ambiente.instagramRotulo;
  protected readonly whatsapp = `https://wa.me/${ambiente.whatsapp}`;
  protected readonly whatsappRotulo = ambiente.whatsappRotulo;
}
