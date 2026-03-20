<?php
// database/seeders/PermissionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Vide le cache des permissions (important !)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ─── Définition de toutes les permissions ─────────────────────────
        $permissions = [

            // Annonces
            'voir annonces',
            'creer annonce',
            'modifier annonce',
            'supprimer annonce',

            // Demandes de location
            'faire demande location',
            'voir demandes recues',
            'accepter demande location',
            'refuser demande location',

            // Messages
            'envoyer message',

            // Admin
            'valider cni',
            'suspendre utilisateur',
            'voir statistiques',
            'moderer annonces',
        ];

        // Crée toutes les permissions en base
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        // ─── Assigne les permissions à chaque rôle ────────────────────────

        // Rôle LOCATAIRE
        Role::findByName('locataire')->givePermissionTo([
            'voir annonces',
            'faire demande location',
            'envoyer message',
        ]);

        // Rôle PROPRIÉTAIRE
        Role::findByName('proprietaire')->givePermissionTo([
            'voir annonces',
            'creer annonce',
            'modifier annonce',
            'supprimer annonce',
            'voir demandes recues',
            'accepter demande location',
            'refuser demande location',
            'envoyer message',
        ]);

        // Rôle ADMIN (toutes les permissions)
        Role::findByName('admin')->givePermissionTo(Permission::all());

        $this->command->info('✅ Permissions créées et assignées aux rôles.');
    }
}