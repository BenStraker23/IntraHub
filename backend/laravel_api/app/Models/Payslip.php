<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payslip extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'uuid',
        'periodo_pago',
        'salario_bruto',
        'salario_neto',
        'hash_sha256',
        'url_descarga',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}