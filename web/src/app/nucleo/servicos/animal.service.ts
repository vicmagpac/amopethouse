import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ambiente } from '../ambiente';
import { Animal, RegistroVacina } from '../modelos';

@Injectable({ providedIn: 'root' })
export class AnimalService {
  private readonly http = inject(HttpClient);
  private readonly base = `${ambiente.apiUrl}/animais`;

  listar() {
    return this.http.get<{ data: Animal[] }>(this.base);
  }

  obter(id: number) {
    return this.http.get<{ data: Animal }>(`${this.base}/${id}`);
  }

  criar(dados: Record<string, unknown>) {
    return this.http.post<{ data: Animal }>(this.base, dados);
  }

  atualizar(id: number, dados: Record<string, unknown>) {
    return this.http.put<{ data: Animal }>(`${this.base}/${id}`, dados);
  }

  excluir(id: number) {
    return this.http.delete<{ mensagem: string }>(`${this.base}/${id}`);
  }

  enviarFoto(id: number, arquivo: File) {
    const corpo = new FormData();
    corpo.append('foto', arquivo);
    return this.http.post<{ data: Animal }>(`${this.base}/${id}/foto`, corpo);
  }

  adicionarVacina(id: number, dados: FormData) {
    return this.http.post<{ data: RegistroVacina }>(`${this.base}/${id}/vacinas`, dados);
  }

  excluirVacina(animalId: number, vacinaId: number) {
    return this.http.delete<{ mensagem: string }>(`${this.base}/${animalId}/vacinas/${vacinaId}`);
  }
}
