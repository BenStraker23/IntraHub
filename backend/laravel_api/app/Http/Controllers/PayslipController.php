<?php

namespace App\Http\Controllers;

use App\Models\Payslip;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PayslipController extends Controller
{
    /**
     * GET /api/payslips
     * Lista las boletas del usuario autenticado.
     */
    public function index(Request $request)
    {
        $usuario = $request->user();

        $boletas = Payslip::where('user_id', $usuario->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id'            => $p->id,
                    'uuid'          => $p->uuid,
                    'periodo_pago'  => $p->periodo_pago,
                    'salario_bruto' => $p->salario_bruto,
                    'salario_neto'  => $p->salario_neto,
                    'hash_sha256'   => $p->hash_sha256,
                    'url_descarga'  => $p->url_descarga,
                    'created_at'    => $p->created_at,
                ];
            });

        return response()->json($boletas);
    }

    /**
     * POST /api/payslips/sync
     * Genera una nueva boleta llamando al microservicio Flask.
     * (Idealmente solo admin / RRHH).
     */
    public function sync(Request $request)
    {
        $usuario = $request->user();

        // Si tienes isAdmin() en el modelo User, úsalo acá
        if (method_exists($usuario, 'isAdmin') && ! $usuario->isAdmin()) {
            return response()->json([
                'message' => 'Solo administradores pueden generar boletas',
            ], 403);
        }

        // 🔹 Campos que se envían desde el frontend en ESPAÑOL
        $data = $request->validate([
            'user_id'       => 'required|exists:users,id',
            'periodo_pago'  => 'required|string|max:50',
            'salario_bruto' => 'required|numeric',
            'salario_neto'  => 'required|numeric',
        ]);

        $empleado = User::findOrFail($data['user_id']);

        // URL del microservicio Flask
        $baseUrl = rtrim(env('FLASK_PAYSLIPS_URL', 'http://127.0.0.1:5001'), '/');

        // 🔁 Mapeamos de ESPAÑOL (Laravel) → INGLÉS (Flask)
        $payload = [
            'employee_id'   => (string) $empleado->id,
            'employee_name' => $empleado->name,
            'period'        => $data['periodo_pago'],
            'gross_amount'  => $data['salario_bruto'],
            'net_amount'    => $data['salario_neto'],
        ];

        $response = Http::post("{$baseUrl}/api/payslips/generate", $payload);

        if (! $response->successful()) {
            return response()->json([
                'message' => 'Error al comunicarse con el microservicio de boletas',
                'error'   => $response->json(),
            ], 500);
        }

        $body = $response->json();

        // Guardamos en BD con campos en ESPAÑOL
        $boleta = Payslip::create([
            'user_id'       => $empleado->id,
            'uuid'          => $body['uuid'] ?? null,
            'periodo_pago'  => $data['periodo_pago'],
            'salario_bruto' => $data['salario_bruto'],
            'salario_neto'  => $data['salario_neto'],
            'hash_sha256'   => $body['sha256'] ?? '',
            'url_descarga'  => $body['download_url'] ?? '',
        ]);

        return response()->json([
            'message' => 'Boleta generada y sincronizada correctamente',
            'boleta'  => $boleta,
        ], 201);
    }
}
