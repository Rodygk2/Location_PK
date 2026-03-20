<?php
// database/seeders/AdminSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'nom'         => 'Super',
            'prenom'      => 'Admin',
            'email'       => 'admin@chambreparakou.bj',
            'telephone'   => '00000000',
            'password'    => 'Admin@1234', // ← Change en production !
            'cni_verifie' => true,
            'statut'      => 'actif',
        ]);

        $admin->assignRole('admin');

        $this->command->info('✅ Compte admin créé : admin@chambreparakou.bj');
    }
}