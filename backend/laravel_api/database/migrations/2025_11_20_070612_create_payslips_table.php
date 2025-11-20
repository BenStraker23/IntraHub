<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payslips', function (Blueprint $table) {
            $table->id();

            // Empleado dueño de la boleta
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // UUID que viene del microservicio
            $table->string('uuid')->unique();

            // 🔹 Campos en español
            $table->string('periodo_pago');                   // antes: period
            $table->decimal('salario_bruto', 10, 2);          // antes: gross_amount
            $table->decimal('salario_neto', 10, 2);           // antes: net_amount

            $table->string('hash_sha256', 64);                // antes: sha256
            $table->text('url_descarga');                     // antes: download_url

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payslips');
    }
};
