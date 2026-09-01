<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('animais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->cascadeOnDelete();
            $table->string('nome');
            $table->string('especie', 20);
            $table->string('raca')->nullable();
            $table->string('porte', 20);
            $table->string('sexo', 20);
            $table->date('data_nascimento')->nullable();
            $table->decimal('peso', 5, 2)->nullable();
            $table->boolean('castrado')->default(false);
            $table->string('temperamento')->nullable();
            $table->text('observacoes')->nullable();
            $table->string('foto_caminho')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('animais');
    }
};
