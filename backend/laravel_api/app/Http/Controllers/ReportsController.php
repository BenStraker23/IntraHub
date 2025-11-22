<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ReportsController extends Controller
{
    public function metrics(Request $request)
    {
        $from = $request->query('from', now()->subMonth()->toDateString());
        $to   = $request->query('to', now()->toDateString());

        $baseUrl = config('services.reports.base_url');

        try {
            $response = Http::timeout(5)->get("$baseUrl/api/metrics", [
                'from' => $from,
                'to'   => $to,
            ]);

            if (! $response->successful()) {
                return response()->json([
                    'message' => 'Error al obtener métricas desde el microservicio.',
                    'status'  => $response->status(),
                    'body'    => $response->json(),
                ], 500);
            }

            return response()->json($response->json(), 200);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'No se pudo contactar al microservicio de reportes.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
