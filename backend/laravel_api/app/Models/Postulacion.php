<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Postulacion extends Model
{
    use HasFactory;

    protected $table = 'postulaciones';

    protected $fillable = [
        'vacante_id',
        'user_id',
        'nombre',
        'cv_path',
        'mensaje',
        'estado',
    ];

    public function vacante()
    {
        return $this->belongsTo(Vacante::class, 'vacante_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function postulaciones()
    {
    return $this->hasMany(Postulacion::class, 'vacante_id');
    }

}
