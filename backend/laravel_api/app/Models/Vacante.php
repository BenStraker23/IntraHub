<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacante extends Model
{
    use HasFactory;

    protected $table = 'vacantes';

    protected $fillable = [
        'titulo',
        'departamento',
        'ubicacion',
        'modalidad',
        'tipo_empleo',
        'salario_min',
        'salario_max',
        'descripcion',
        'estado',
        'publicada_en',
        'fecha_limite',
        'user_id',
    ];

    protected $casts = [
        'publicada_en' => 'datetime',
        'fecha_limite' => 'date',
    ];

    public function autor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
