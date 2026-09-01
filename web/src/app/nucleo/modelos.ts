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
