<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\VacanteController;
use App\Http\Controllers\PostulacionController;
use App\Http\Controllers\PayslipController;
use App\Http\Controllers\ReportsController;
// Todas estas rutas usan el grupo "api" (SIN CSRF)

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Noticias públicas
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{news}', [NewsController::class, 'show']);
Route::get('/vacantes', [VacanteController::class, 'index']);
Route::get('/vacantes/{vacante}', [VacanteController::class, 'show']);

// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // CRUD de noticias (solo admin en el controller)
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{news}', [NewsController::class, 'update']);
    Route::delete('/news/{news}', [NewsController::class, 'destroy']);
    Route::post('/vacantes', [VacanteController::class, 'store']);
    Route::put('/vacantes/{vacante}', [VacanteController::class, 'update']);
    Route::delete('/vacantes/{vacante}', [VacanteController::class, 'destroy']);
    Route::get('/payslips', [PayslipController::class, 'index']);
    Route::post('/payslips/sync', [PayslipController::class, 'sync']);

     // Enviar CV a una vacante (empleado)
    Route::post('/vacantes/{vacante}/postulaciones', [PostulacionController::class, 'store']);

    // Ver mis postulaciones (empleado)
    Route::get('/mis-postulaciones', [PostulacionController::class, 'misPostulaciones']);

    // Ver postulaciones de una vacante (admin)
    Route::get('/vacantes/{vacante}/postulaciones', [PostulacionController::class, 'listarPorVacante']);

    // Cambiar estado de una postulación (admin)
    Route::patch('/postulaciones/{postulacion}', [PostulacionController::class, 'actualizarEstado']);
    Route::get('/reports/metrics', [ReportsController::class, 'metrics']);
});
