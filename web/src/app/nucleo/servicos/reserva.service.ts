import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ambiente } from '../ambiente';
import { BloqueioEquipe, ConfiguracaoCasa, DiaDisponivel, PainelAdmin, Reserva, TipoServico } from '../modelos';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly http = inject(HttpClient);
  private readonly api = ambiente.apiUrl;

  listarTipos() {
    return this.http.get<{ data: TipoServico[] }>(`${this.api}/tipos-servico`);
  }

  disponibilidade(tipoServicoId: number, de: string, ate: string) {
    return this.http.get<{ data: { tipo_servico: TipoServico; dias: DiaDisponivel[] } }>(
      `${this.api}/disponibilidade`,
      { params: { tipo_servico_id: tipoServicoId, de, ate } },
    );
  }

  listar() {
    return this.http.get<{ data: Reserva[] }>(`${this.api}/reservas`);
  }

  obter(id: number) {
    return this.http.get<{ data: Reserva }>(`${this.api}/reservas/${id}`);
  }

  criar(dados: Record<string, unknown>) {
    return this.http.post<{ data: Reserva }>(`${this.api}/reservas`, dados);
  }

  cancelar(id: number) {
    return this.http.post<{ data: Reserva }>(`${this.api}/reservas/${id}/cancelar`, {});
  }

  painelAdmin() {
    return this.http.get<{ data: PainelAdmin }>(`${this.api}/admin/painel`);
  }

  listarAdmin(filtros: { status?: string; tipo_servico_id?: number } = {}) {
    const params: Record<string, string> = {};
    if (filtros.status) {
      params['status'] = filtros.status;
    }
    if (filtros.tipo_servico_id) {
      params['tipo_servico_id'] = String(filtros.tipo_servico_id);
    }
    return this.http.get<{ data: Reserva[] }>(`${this.api}/admin/reservas`, { params });
  }

  iniciar(id: number) {
    return this.http.post<{ data: Reserva }>(`${this.api}/admin/reservas/${id}/iniciar`, {});
  }

  confirmar(id: number) {
    return this.http.post<{ data: Reserva }>(`${this.api}/admin/reservas/${id}/confirmar`, {});
  }

  concluir(id: number) {
    return this.http.post<{ data: Reserva }>(`${this.api}/admin/reservas/${id}/concluir`, {});
  }

  marcarPago(id: number) {
    return this.http.post<{ data: Reserva }>(`${this.api}/admin/reservas/${id}/pagamento`, {});
  }

  tiposAdmin() {
    return this.http.get<{ data: TipoServico[] }>(`${this.api}/admin/tipos-servico`);
  }

  configuracaoAdmin() {
    return this.http.get<{ data: ConfiguracaoCasa }>(`${this.api}/admin/configuracao`);
  }

  atualizarConfiguracao(dados: ConfiguracaoCasa) {
    return this.http.put<{ data: ConfiguracaoCasa }>(`${this.api}/admin/configuracao`, dados);
  }

  atualizarTipo(id: number, dados: Record<string, unknown>) {
    return this.http.put<{ data: TipoServico }>(`${this.api}/admin/tipos-servico/${id}`, dados);
  }

  listarBloqueios() {
    return this.http.get<{ data: BloqueioEquipe[] }>(`${this.api}/admin/bloqueios`);
  }

  criarBloqueio(dados: Record<string, unknown>) {
    return this.http.post<{ data: BloqueioEquipe }>(`${this.api}/admin/bloqueios`, dados);
  }

  excluirBloqueio(id: number) {
    return this.http.delete<{ mensagem: string }>(`${this.api}/admin/bloqueios/${id}`);
  }
}
