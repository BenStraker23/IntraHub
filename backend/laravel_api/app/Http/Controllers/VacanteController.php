<?php

namespace App\Http\Controllers;

use App\Models\Vacante;
use Illuminate\Http\Request;

class VacanteController extends Controller
{
    /**
     * Listar todas las vacantes públicas
     */
    public function index(Request $request)
    {
        $estado = $request->query('estado', 'abierta');
        $buscar = $request->query('buscar');

        $query = Vacante::with('autor:id,name')
            ->orderByDesc('publicada_en')
            ->orderByDesc('created_at');

        if ($estado) {
            $query->where('estado', $estado);
        }

        if ($buscar) {
            $query->where(function ($q) use ($buscar) {
                $q->where('titulo', 'like', "%{$buscar}%")
                  ->orWhere('departamento', 'like', "%{$buscar}%")
                  ->orWhere('ubicacion', 'like', "%{$buscar}%");
            });
        }

        return response()->json($query->get());
    }

    /**
     * Mostrar una vacante en específico
     */
    public function show(Vacante $vacante)
    {
        $vacante->load('autor:id,name');
        return response()->json($vacante);
    }

    /**
     * Crear una nueva vacante (solo admin)
     */
    public function store(Request $request)
    {
        $usuario = $request->user();

        if (! $usuario->isAdmin()) {
            return response()->json([
                'message' => 'Solo los administradores pueden crear vacantes'
            ], 403);
        }

        $data = $request->validate([
            'titulo'        => 'required|string|max:255',
            'departamento'  => 'nullable|string|max:255',
            'ubicacion'     => 'nullable|string|max:255',
            'modalidad'     => 'nullable|in:presencial,remoto,híbrido',
            'tipo_empleo'   => 'nullable|in:tiempo_completo,medio_tiempo,temporal,prácticas',
            'salario_min'   => 'nullable|integer',
            'salario_max'   => 'nullable|integer',
            'descripcion'   => 'required|string',
            'estado'        => 'nullable|in:abierta,cerrada',
            'publicada_en'  => 'nullable|date',
            'fecha_limite'  => 'nullable|date',
        ]);

        $vacante = Vacante::create([
            'titulo'        => $data['titulo'],
            'departamento'  => $data['departamento'] ?? null,
            'ubicacion'     => $data['ubicacion'] ?? 'Ciudad de Guatemala',
            'modalidad'     => $data['modalidad'] ?? 'presencial',
            'tipo_empleo'   => $data['tipo_empleo'] ?? 'tiempo_completo',
            'salario_min'   => $data['salario_min'] ?? null,
            'salario_max'   => $data['salario_max'] ?? null,
            'descripcion'   => $data['descripcion'],
            'estado'        => $data['estado'] ?? 'abierta',
            'publicada_en'  => $data['publicada_en'] ?? now(),
            'fecha_limite'  => $data['fecha_limite'] ?? null,
            'user_id'       => $usuario->id,
        ]);

        return response()->json($vacante, 201);
    }

    /**
     * Editar una vacante (solo admin)
     */
    public function update(Request $request, Vacante $vacante)
    {
        $usuario = $request->user();

        if (! $usuario->isAdmin()) {
            return response()->json([
                'message' => 'Solo los administradores pueden editar vacantes'
            ], 403);
        }

        $data = $request->validate([
            'titulo'        => 'sometimes|required|string|max:255',
            'departamento'  => 'nullable|string|max:255',
            'ubicacion'     => 'nullable|string|max:255',
            'modalidad'     => 'nullable|in:presencial,remoto,híbrido',
            'tipo_empleo'   => 'nullable|in:tiempo_completo,medio_tiempo,temporal,prácticas',
            'salario_min'   => 'nullable|integer',
            'salario_max'   => 'nullable|integer',
            'descripcion'   => 'sometimes|required|string',
            'estado'        => 'nullable|in:abierta,cerrada',
            'publicada_en'  => 'nullable|date',
            'fecha_limite'  => 'nullable|date',
        ]);

        $vacante->update($data);

        return response()->json($vacante);
    }

    /**
     * Eliminar una vacante (solo admin)
     */
    public function destroy(Request $request, Vacante $vacante)
    {
        $usuario = $request->user();

        if (! $usuario->isAdmin()) {
            return response()->json([
                'message' => 'Solo los administradores pueden eliminar vacantes'
            ], 403);
        }

        $vacante->delete();

        return response()->json(['message' => 'Vacante eliminada correctamente']);
    }
}
