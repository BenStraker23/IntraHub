<?php

namespace App\Http\Controllers;

use App\Models\Postulacion;
use App\Models\Vacante;
use Illuminate\Http\Request;

class PostulacionController extends Controller
{
    /**
     * Enviar postulación a una vacante (empleado autenticado)
     * POST /api/vacantes/{vacante}/postulaciones
     */
    public function store(Request $request, Vacante $vacante)
    {
        $usuario = $request->user();

        // Validar archivo y mensaje
        $data = $request->validate([
            'cv'      => 'required|file|mimes:pdf,doc,docx|max:5120', // máx 5MB
            'mensaje' => 'nullable|string',
        ]);

        // Verificar que no se haya postulado antes
        $existe = Postulacion::where('vacante_id', $vacante->id)
            ->where('user_id', $usuario->id)
            ->exists();

        if ($existe) {
            return response()->json([
                'message' => 'Ya te has postulado a esta vacante',
            ], 422);
        }

        // Guardar CV en storage/app/public/cv
        $extension = $request->file('cv')->getClientOriginalExtension();
        $nombreLimpio = str_replace(' ', '_', $usuario->name);
        $nombreArchivo = $nombreLimpio . '_CV_' . now()->format('Ymd_His') . '.' . $extension;

        $path = $request->file('cv')->storeAs('cv', $nombreArchivo, 'public');

        // Crear registro de postulación
        $postulacion = Postulacion::create([
            'vacante_id' => $vacante->id,
            'user_id'    => $usuario->id,
            'nombre'     => $usuario->name,          // 👈 aquí guardamos el nombre del usuario
            'cv_path'    => $path,
            'mensaje'    => $data['mensaje'] ?? null,
            'estado'     => 'enviada',
        ]);

        return response()->json([
            'message'     => 'Postulación enviada correctamente',
            'postulacion' => [
                'id'         => $postulacion->id,
                'vacante_id' => $postulacion->vacante_id,
                'user_id'    => $postulacion->user_id,
                'nombre'     => $postulacion->nombre,
                'cv_url'     => asset('storage/' . $postulacion->cv_path),
                'mensaje'    => $postulacion->mensaje,
                'estado'     => $postulacion->estado,
                'created_at' => $postulacion->created_at,
            ],
        ], 201);
    }

    /**
     * Ver mis postulaciones (empleado autenticado)
     * GET /api/mis-postulaciones
     */
    public function misPostulaciones(Request $request)
    {
        $usuario = $request->user();

        $postulaciones = Postulacion::with('vacante:id,titulo,departamento,ubicacion,estado')
            ->where('user_id', $usuario->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id'         => $p->id,
                    'vacante'    => [
                        'id'          => $p->vacante->id,
                        'titulo'      => $p->vacante->titulo,
                        'departamento'=> $p->vacante->departamento,
                        'ubicacion'   => $p->vacante->ubicacion,
                        'estado'      => $p->vacante->estado,
                    ],
                    'nombre'     => $p->nombre,
                    'cv_url'     => asset('storage/' . $p->cv_path),
                    'mensaje'    => $p->mensaje,
                    'estado'     => $p->estado,
                    'created_at' => $p->created_at,
                ];
            });

        return response()->json($postulaciones);
    }

    /**
     * Ver postulaciones de una vacante (solo admin)
     * GET /api/vacantes/{vacante}/postulaciones
     */
    public function listarPorVacante(Request $request, Vacante $vacante)
    {
        $usuario = $request->user();

        if (! $usuario->isAdmin()) {
            return response()->json([
                'message' => 'Solo los administradores pueden ver postulaciones',
            ], 403);
        }

        $postulaciones = Postulacion::with('usuario:id,name,email')
            ->where('vacante_id', $vacante->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($p) {
                return [
                    'id'         => $p->id,
                    'nombre'     => $p->nombre, // nombre guardado en la tabla
                    'usuario'    => [
                        'id'    => $p->usuario->id,
                        'name'  => $p->usuario->name,
                        'email' => $p->usuario->email,
                    ],
                    'cv_url'     => asset('storage/' . $p->cv_path),
                    'mensaje'    => $p->mensaje,
                    'estado'     => $p->estado,
                    'created_at' => $p->created_at,
                ];
            });

        return response()->json($postulaciones);
    }

    /**
     * Cambiar estado de una postulación (solo admin)
     * PATCH /api/postulaciones/{postulacion}
     */
    public function actualizarEstado(Request $request, Postulacion $postulacion)
    {
        $usuario = $request->user();

        if (! $usuario->isAdmin()) {
            return response()->json([
                'message' => 'Solo los administradores pueden actualizar postulaciones',
            ], 403);
        }

        $data = $request->validate([
            'estado' => 'required|in:enviada,en_revision,aceptada,rechazada',
        ]);

        $postulacion->update([
            'estado' => $data['estado'],
        ]);

        return response()->json([
            'message'     => 'Estado actualizado correctamente',
            'postulacion' => $postulacion,
        ]);
    }
}