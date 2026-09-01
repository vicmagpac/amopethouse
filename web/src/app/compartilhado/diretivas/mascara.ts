import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { aplicarMascara, TipoMascara } from '../util/mascara';

@Directive({
  selector: 'input[mascara]',
})
export class Mascara {
  readonly mascara = input.required<TipoMascara>();
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly controle = inject(NgControl, { optional: true, self: true });

  @HostListener('input')
  @HostListener('blur')
  aplicar(): void {
    const mascarado = aplicarMascara(this.el.nativeElement.value, this.mascara());
    this.el.nativeElement.value = mascarado;
    this.controle?.control?.setValue(mascarado, { emitEvent: false });
  }
}
