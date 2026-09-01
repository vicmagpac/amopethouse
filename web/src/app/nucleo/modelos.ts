export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string | null;
  papel: 'tutor' | 'administrador';
  email_verificado: boolean;
  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  contato_emergencia_nome: string | null;
  contato_emergencia_telefone: string | null;
}

export interface RegistroVacina {
  id: number;
  nome: string;
  aplicada_em: string;
  expira_em: string | null;
  documento_url: string | null;
}

export interface Animal {
  id: number;
  nome: string;
  especie: 'cao' | 'gato';
  especie_rotulo: string;
  raca: string | null;
  porte: 'pequeno' | 'medio' | 'grande';
  porte_rotulo: string;
  sexo: 'macho' | 'femea';
  sexo_rotulo: string;
  data_nascimento: string | null;
  peso: string | number | null;
  castrado: boolean;
  temperamento: string | null;
  observacoes: string | null;
  foto_url: string | null;
  vacinas?: RegistroVacina[];
}

export interface RespostaAutenticacao {
  data: Usuario;
  token: string;
}

export interface TipoServico {
  id: number;
  nome: string;
  slug: 'hospedagem' | 'creche' | 'cuidador' | 'passeio' | 'transporte' | 'acompanhamento';
  descricao: string | null;
  preco: string | number;
  preco_turno_longo: string | number | null;
  duracao_minutos: number;
  capacidade: number;
  exige_vacina: boolean;
  ativo: boolean;
}

export interface PagamentoReserva {
  status: 'a_receber' | 'recebido';
  status_rotulo: string;
  meio: string;
  meio_rotulo: string;
  valor: string | number;
  recebido_em: string | null;
}

export interface Reserva {
  id: number;
  status: 'confirmada' | 'em_andamento' | 'concluida' | 'cancelada';
  status_rotulo: string;
  inicio: string;
  fim: string;
  valor_total: string | number;
  turno: 'quatro_horas' | 'oito_horas' | null;
  turno_rotulo: string | null;
  endereco: string | null;
  origem: string | null;
  destino: string | null;
  local_compromisso: string | null;
  observacoes: string | null;
  tipo_servico?: TipoServico;
  animais?: Animal[];
  tutor?: Usuario;
  pagamento?: PagamentoReserva | null;
}

export interface DiaDisponivel {
  data: string;
  disponivel: boolean;
  vagas?: number;
  horarios?: string[];
  turnos?: { turno: string; rotulo: string; vagas: number; disponivel: boolean }[];
}

export interface BloqueioEquipe {
  id: number;
  tipo_servico_id: number | null;
  tipo_servico_nome?: string | null;
  inicio: string;
  fim: string;
  motivo: string | null;
}

export interface PainelAdmin {
  reservas_hoje: number;
  proximos_7_dias: number;
  a_receber: string | number;
  recebido_mes: string | number;
  por_servico: { id: number; nome: string; slug: string; quantidade: number; capacidade: number }[];
  agenda: Reserva[];
}
