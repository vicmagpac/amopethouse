import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { somenteDigitos } from '../../compartilhado/util/mascara';

export interface EnderecoCep {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface RespostaViaCep {
  erro?: boolean | string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

@Injectable({ providedIn: 'root' })
export class CepService {
  private readonly http = inject(HttpClient);

  buscar(cep: string): Observable<EnderecoCep | null> {
    const digitos = somenteDigitos(cep);
    if (digitos.length !== 8) {
      return of(null);
    }

    return this.http.get<RespostaViaCep>(`https://viacep.com.br/ws/${digitos}/json/`).pipe(
      map((resposta) => {
        if (resposta.erro === true || resposta.erro === 'true') {
          return null;
        }

        return {
          rua: resposta.logradouro ?? '',
          bairro: resposta.bairro ?? '',
          cidade: resposta.localidade ?? '',
          estado: (resposta.uf ?? '').toUpperCase(),
        };
      }),
      catchError(() => of(null)),
    );
  }
}
