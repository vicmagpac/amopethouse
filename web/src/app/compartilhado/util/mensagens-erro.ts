import { HttpErrorResponse } from '@angular/common/http';

export function mensagensErro(erro: unknown): string[] {
  if (!(erro instanceof HttpErrorResponse)) {
    return ['Não foi possível concluir a operação.'];
  }

  const erros = erro.error?.errors as Record<string, string[]> | undefined;
  if (erros) {
    return Object.values(erros).flat();
  }

  if (typeof erro.error?.mensagem === 'string') {
    return [erro.error.mensagem];
  }

  if (typeof erro.error?.message === 'string') {
    return [erro.error.message];
  }

  return ['Não foi possível concluir a operação.'];
}
