<?php
// database/seeders/RoleSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Crée les 3 rôles de l'application
        Role::create(['name' => 'locataire',    'guard_name' => 'web']);
        Role::create(['name' => 'proprietaire', 'guard_name' => 'web']);
        Role::create(['name' => 'admin',        'guard_name' => 'web']);

        $this->command->info('✅ Rôles créés : locataire, proprietaire, admin');
    }
}