<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipos_servico', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('slug', 40)->unique();
            $table->text('descricao')->nullable();
            $table->decimal('preco', 10, 2);
            $table->decimal('preco_turno_longo', 10, 2)->nullable();
            $table->unsignedInteger('duracao_minutos')->default(60);
            $table->unsignedInteger('capacidade')->default(1);
            $table->boolean('exige_vacina')->default(false);
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });

        Schema::create('bloqueios_equipe', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tipo_servico_id')->nullable()->constrained('tipos_servico')->nullOnDelete();
            $table->dateTime('inicio');
            $table->dateTime('fim');
            $table->string('motivo')->nullable();
            $table->timestamps();
        });

        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->cascadeOnDelete();
            $table->foreignId('tipo_servico_id')->constrained('tipos_servico');
            $table->string('status', 30);
            $table->dateTime('inicio');
            $table->dateTime('fim');
            $table->decimal('valor_total', 10, 2);
            $table->string('turno', 30)->nullable();
            $table->string('endereco')->nullable();
            $table->string('origem')->nullable();
            $table->string('destino')->nullable();
            $table->string('local_compromisso')->nullable();
            $table->text('observacoes')->nullable();
            $table->timestamps();
        });

        Schema::create('reserva_animais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reserva_id')->constrained('reservas')->cascadeOnDelete();
            $table->foreignId('animal_id')->constrained('animais')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['reserva_id', 'animal_id']);
        });

        Schema::create('pagamentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reserva_id')->constrained('reservas')->cascadeOnDelete();
            $table->string('status', 30);
            $table->string('meio', 30);
            $table->decimal('valor', 10, 2);
            $table->timestamp('recebido_em')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagamentos');
        Schema::dropIfExists('reserva_animais');
        Schema::dropIfExists('reservas');
        Schema::dropIfExists('bloqueios_equipe');
        Schema::dropIfExists('tipos_servico');
    }
};
