<?php

namespace Database\Seeders;

use App\Enums\TipoServicoSlug;
use App\Models\TipoServico;
use Illuminate\Database\Seeder;

class TipoServicoSeeder extends Seeder
{
    public function run(): void
    {
        $servicos = [
            [
                'nome' => 'Hospedagem afetiva',
                'slug' => TipoServicoSlug::Hospedagem,
                'descricao' => 'Cuidado 24h para cães e gatos, com liberdade para circular e atenção individual.',
                'preco' => 120,
                'preco_turno_longo' => null,
                'duracao_minutos' => 1440,
                'capacidade' => 6,
                'exige_vacina' => true,
            ],
            [
                'nome' => 'Creche',
                'slug' => TipoServicoSlug::Creche,
                'descricao' => 'Turnos de 4h ou 8h com supervisão, brincadeira e descanso.',
                'preco' => 70,
                'preco_turno_longo' => 110,
                'duracao_minutos' => 240,
                'capacidade' => 6,
                'exige_vacina' => true,
            ],
            [
                'nome' => 'Pet sitter',
                'slug' => TipoServicoSlug::Cuidador,
                'descricao' => 'Visita na casa do tutor para preservar a rotina do pet.',
                'preco' => 80,
                'preco_turno_longo' => null,
                'duracao_minutos' => 60,
                'capacidade' => 4,
                'exige_vacina' => false,
            ],
            [
                'nome' => 'Passeio',
                'slug' => TipoServicoSlug::Passeio,
                'descricao' => 'Caminhada de 1 hora com foco em movimento e gasto de energia.',
                'preco' => 50,
                'preco_turno_longo' => null,
                'duracao_minutos' => 60,
                'capacidade' => 4,
                'exige_vacina' => false,
            ],
            [
                'nome' => 'Transporte pet',
                'slug' => TipoServicoSlug::Transporte,
                'descricao' => 'Leva e traz com segurança para o hotel, a creche ou o veterinário.',
                'preco' => 60,
                'preco_turno_longo' => null,
                'duracao_minutos' => 60,
                'capacidade' => 3,
                'exige_vacina' => false,
            ],
            [
                'nome' => 'Acompanhamento',
                'slug' => TipoServicoSlug::Acompanhamento,
                'descricao' => 'Apoio em consultas, exames e outros compromissos veterinários.',
                'preco' => 70,
                'preco_turno_longo' => null,
                'duracao_minutos' => 120,
                'capacidade' => 3,
                'exige_vacina' => false,
            ],
        ];

        foreach ($servicos as $servico) {
            TipoServico::query()->updateOrCreate(
                ['slug' => $servico['slug']],
                [...$servico, 'ativo' => true],
            );
        }
    }
}
