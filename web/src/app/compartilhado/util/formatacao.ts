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
