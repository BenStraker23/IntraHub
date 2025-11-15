<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador
        User::updateOrCreate(
            ['email' => 'admin@intrahub.com'],
            [
                'name' => 'Administrador IntraHub',
                'email' => 'admin@intrahub.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Crear usuario empleado de prueba
        User::updateOrCreate(
            ['email' => 'empleado@intrahub.com'],
            [
                'name' => 'Juan Pérez',
                'email' => 'empleado@intrahub.com',
                'password' => Hash::make('empleado123'),
                'role' => 'cliente',
                'email_verified_at' => now(),
            ]
        );

        // Crear más empleados de prueba
        User::updateOrCreate(
            ['email' => 'maria@intrahub.com'],
            [
                'name' => 'María González',
                'email' => 'maria@intrahub.com',
                'password' => Hash::make('maria123'),
                'role' => 'cliente',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'carlos@intrahub.com'],
            [
                'name' => 'Carlos Rodríguez',
                'email' => 'carlos@intrahub.com',
                'password' => Hash::make('carlos123'),
                'role' => 'cliente',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Usuarios creados:');
        $this->command->info('Admin: admin@intrahub.com / admin123');
        $this->command->info('Empleado: empleado@intrahub.com / empleado123');
        $this->command->info('Empleado: maria@intrahub.com / maria123');
        $this->command->info('Empleado: carlos@intrahub.com / carlos123');
    }
}
