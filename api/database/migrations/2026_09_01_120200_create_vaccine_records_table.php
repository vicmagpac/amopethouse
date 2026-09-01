<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registros_vacinas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('animal_id')->constrained('animais')->cascadeOnDelete();
            $table->string('nome');
            $table->date('aplicada_em');
            $table->date('expira_em')->nullable();
            $table->string('documento_caminho')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registros_vacinas');
    }
};
