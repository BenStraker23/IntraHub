<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
Schema::create('vacantes', function (Blueprint $table) {
    $table->id();
    $table->string('titulo');
    $table->string('departamento')->nullable();
    $table->string('ubicacion')->default('Ciudad de Guatemala');
    $table->enum('modalidad', ['presencial', 'remoto', 'híbrido'])->default('presencial');
    $table->enum('tipo_empleo', ['tiempo_completo', 'medio_tiempo', 'temporal', 'prácticas'])
          ->default('tiempo_completo');
    $table->integer('salario_min')->nullable();
    $table->integer('salario_max')->nullable();
    $table->text('descripcion');
    $table->enum('estado', ['abierta', 'cerrada'])->default('abierta');
    $table->timestamp('publicada_en')->nullable();
    $table->date('fecha_limite')->nullable();
    $table->foreignId('user_id')->constrained('users');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacantes');
    }
};
