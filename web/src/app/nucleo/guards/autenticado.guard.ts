import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacaoService } from '../servicos/autenticacao.service';

export const autenticadoGuard: CanActivateFn = () => {
  const autenticacao = inject(AutenticacaoService);
  const router = inject(Router);

  if (autenticacao.autenticado()) {
    return true;
  }

  return router.createUrlTree(['/entrar']);
};
