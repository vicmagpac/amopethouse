import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs';
import { CepService } from '../../nucleo/servicos/cep.service';
import { Mascara } from '../diretivas/mascara';
import { somenteDigitos } from '../util/mascara';

@Component({
  selector: 'app-campos-endereco',
  imports: [ReactiveFormsModule, Mascara, MatFormFieldModule, MatInputModule],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    <div class="endereco">
      <mat-form-field appearance="outline" class="largo">
        <mat-label>CEP</mat-label>
        <input
          matInput
          formControlName="cep"
          mascara="cep"
          placeholder="00000-000"
          inputmode="numeric"
          autocomplete="postal-code"
          maxlength="9"
        />
        @if (buscandoCep()) {
          <mat-hint>Buscando endereço...</mat-hint>
        } @else {
          <mat-hint>Preencha rua, bairro, cidade e estado</mat-hint>
        }
      </mat-form-field>
      @if (erroCep()) {
        <p class="aviso-cep">{{ erroCep() }}</p>
      }

      <mat-form-field appearance="outline" class="largo">
        <mat-label>Rua</mat-label>
        <input matInput formControlName="rua" autocomplete="address-line1" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Número</mat-label>
        <input matInput formControlName="numero" autocomplete="address-line2" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Complemento</mat-label>
        <input matInput formControlName="complemento" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="largo">
        <mat-label>Bairro</mat-label>
        <input matInput formControlName="bairro" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Cidade</mat-label>
        <input matInput formControlName="cidade" autocomplete="address-level2" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Estado</mat-label>
        <input matInput formControlName="estado" maxlength="2" autocomplete="address-level1" />
      </mat-form-field>
    </div>
  `,
  styles: `
    .endereco {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.25rem 1rem;
    }
    .largo {
      grid-column: 1 / -1;
    }
    .aviso-cep {
      grid-column: 1 / -1;
      margin: -0.4rem 0 0.4rem;
      color: #9b2c2c;
      font-size: 0.85rem;
    }
    @media (max-width: 640px) {
      .endereco {
        grid-template-columns: 1fr;
      }
      .largo {
        grid-column: 1;
      }
    }
  `,
})
export class CamposEndereco implements OnInit {
  private readonly formularioPai = inject(FormGroupDirective);
  private readonly cep = inject(CepService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly buscandoCep = signal(false);
  protected readonly erroCep = signal('');

  ngOnInit() {
    this.formularioPai.form
      .get('cep')
      ?.valueChanges.pipe(
        map((valor) => somenteDigitos(valor)),
        debounceTime(250),
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

        this.formularioPai.form.patchValue(
          {
            rua: endereco.rua,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
          },
          { emitEvent: false },
        );
      });
  }
}
