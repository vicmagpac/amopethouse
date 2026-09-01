export type TipoMascara = 'cpf' | 'telefone' | 'cep';

export function somenteDigitos(valor: string | null | undefined): string {
  return (valor ?? '').replace(/\D+/g, '');
}

export function aplicarMascara(valor: string | null | undefined, tipo: TipoMascara): string {
  const digitos = somenteDigitos(valor);

  if (tipo === 'cpf') {
    return digitos
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  if (tipo === 'cep') {
    return digitos.slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
  }

  const telefone = digitos.slice(0, 11);
  if (telefone.length <= 10) {
    return telefone.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }

  return telefone.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}
