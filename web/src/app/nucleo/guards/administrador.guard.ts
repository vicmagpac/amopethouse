import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacaoService } from '../servicos/autenticacao.service';

export const administradorGuard: CanActivateFn = () => {
  const autenticacao = inject(AutenticacaoService);
  const router = inject(Router);

  if (autenticacao.autenticado() && autenticacao.usuario()?.papel === 'administrador') {
    return true;
  }

  if (!autenticacao.autenticado()) {
    return router.createUrlTree(['/entrar']);
  }

  return router.createUrlTree(['/conta']);
};
