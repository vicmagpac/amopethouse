import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ambiente } from '../ambiente';
import { AutenticacaoService } from '../servicos/autenticacao.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(ambiente.apiUrl)) {
    return next(req);
  }

  const autenticacao = inject(AutenticacaoService);
  const router = inject(Router);
  const token = autenticacao.token();

  const requisicao = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
    : req.clone({ setHeaders: { Accept: 'application/json' } });

  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401 && !req.url.includes('/entrar')) {
        autenticacao.limparSessao();
        void router.navigate(['/entrar']);
      }
      return throwError(() => erro);
    }),
  );
};
