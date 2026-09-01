import { Directive, ElementRef, HostListener, afterNextRender, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { aplicarMascara, TipoMascara } from '../util/mascara';

@Directive({
  selector: 'input[mascara]',
})
export class Mascara {
  readonly mascara = input.required<TipoMascara>();
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly controle = inject(NgControl, { optional: true, self: true });

  constructor() {
    afterNextRender(() => this.aplicar(false));
  }

  @HostListener('input')
  @HostListener('blur')
  aoAlterar(): void {
    this.aplicar(true);
  }

  private aplicar(emitirEvento: boolean): void {
    const campo = this.el.nativeElement;
    const mascarado = aplicarMascara(campo.value, this.mascara());
    campo.value = mascarado;
    this.controle?.control?.setValue(mascarado, { emitEvent: emitirEvento });
  }
}
