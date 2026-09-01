import { Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs';
import { CepService } from '../../nucleo/servicos/cep.service';
import { Mascara } from '../diretivas/mascara';
import { somenteDigitos } from '../util/mascara';

@Component({
  selector: 'app-campos-endereco',
  imports: [ReactiveFormsModule, Mascara],
  template: `
    <div class="endereco" [formGroup]="grupo()">
      <label>
        CEP
        <input
          formControlName="cep"
          mascara="cep"
          placeholder="00000-000"
          inputmode="numeric"
          autocomplete="postal-code"
          maxlength="9"
        />
      </label>
      @if (buscandoCep()) {
        <p class="ajuda">Buscando endereço...</p>
      }
      @if (erroCep()) {
        <p class="aviso">{{ erroCep() }}</p>
      }
      <p class="ajuda">Digite o CEP para preencher rua, bairro, cidade e estado. Depois complete o número.</p>
      <label>Rua <input formControlName="rua" autocomplete="address-line1" /></label>
      <div class="linha">
        <label>Número <input formControlName="numero" autocomplete="address-line2" /></label>
        <label>Complemento <input formControlName="complemento" /></label>
      </div>
      <label>Bairro <input formControlName="bairro" /></label>
      <div class="linha">
        <label>Cidade <input formControlName="cidade" autocomplete="address-level2" /></label>
        <label>Estado <input formControlName="estado" maxlength="2" autocomplete="address-level1" /></label>
      </div>
    </div>
  `,
  styles: `
    .linha {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .ajuda,
    .aviso {
      margin: -0.35rem 0 0.7rem;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .ajuda {
      color: #5b6f55;
    }
    .aviso {
      color: #9b2c2c;
    }
  `,
})
export class CamposEndereco implements OnInit {
  readonly grupo = input.required<FormGroup>();
  private readonly cep = inject(CepService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly buscandoCep = signal(false);
  protected readonly erroCep = signal('');

  ngOnInit() {
    this.grupo()
      .get('cep')
      ?.valueChanges.pipe(
        map((valor) => somenteDigitos(valor)),
        distinctUntilChanged(),
        filter((digitos) => {
          if (digitos.length !== 8) {
            this.erroCep.set('');
            return false;
          }
          return true;
        }),
        switchMap((digitos) => {
          this.buscandoCep.set(true);
          this.erroCep.set('');
          return this.cep.buscar(digitos).pipe(finalize(() => this.buscandoCep.set(false)));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((endereco) => {
        if (!endereco) {
          this.erroCep.set('CEP não encontrado. Preencha o endereço manualmente.');
          return;
        }

        this.grupo().patchValue({
          rua: endereco.rua,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado,
        });
      });
  }
}
