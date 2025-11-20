<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('postulaciones', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vacante_id')
                  ->constrained('vacantes')
                  ->onDelete('cascade');

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // 👇 Aquí guardamos el nombre de la persona que se postuló
            $table->string('nombre');

            // Ruta al archivo del CV
            $table->string('cv_path');

            // Mensaje opcional
            $table->text('mensaje')->nullable();

            $table->enum('estado', ['enviada', 'en_revision', 'aceptada', 'rechazada'])
                  ->default('enviada');

            $table->timestamps();

            // Un usuario solo puede postularse una vez a la misma vacante
            $table->unique(['vacante_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('postulaciones');
    }
};