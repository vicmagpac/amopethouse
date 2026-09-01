export function reais(valor: string | number | null | undefined): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor ?? 0));
}

export function dataHora(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function soData(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }
  const soDia = iso.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(soDia)) {
    const [ano, mes, dia] = soDia.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function dataIso(data: Date = new Date()): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function deIso(iso: string | null | undefined): Date | null {
  if (!iso) {
    return null;
  }
  const soDia = iso.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(soDia)) {
    return null;
  }
  const [ano, mes, dia] = soDia.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function pago(status: 'a_receber' | 'recebido' | null | undefined): boolean {
  return status === 'recebido';
}

export function rotuloPagamento(status: 'a_receber' | 'recebido' | null | undefined): string {
  return pago(status) ? 'Pago' : 'Pendente de pagamento';
}
