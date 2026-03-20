<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Annonce;
use App\Models\Localisation;

class AnnonceSeeder extends Seeder
{
    public function run(): void
    {
        $proprio = User::role('proprietaire')->first();

        if (!$proprio) {
            $proprio = User::create([
                'nom'         => 'Kéita',
                'prenom'      => 'Adama',
                'email'       => 'proprio@test.com',
                'telephone'   => '97000001',
                'password'    => bcrypt('password'),
                'cni_verifie' => true,
                'statut'      => 'actif',
            ]);
            $proprio->assignRole('proprietaire');
        }

        $annonces = [
            [
                'titre'        => 'Chambre meublée climatisée Banikanni',
                'description'  => 'Belle chambre meublée avec climatisation, eau courante et électricité. Quartier calme et sécurisé.',
                'type_chambre' => 'chambre_simple',
                'prix'         => 25000,
                'meublee'      => true,
                'statut'       => 'publiee',
                'quartier'     => 'Banikanni',
                'ville'        => 'Parakou',
            ],
            [
                'titre'        => 'Studio moderne centre ville',
                'description'  => 'Studio tout équipé au centre de Parakou. Cuisine intégrée, douche privée, parking disponible.',
                'type_chambre' => 'studio',
                'prix'         => 45000,
                'meublee'      => true,
                'statut'       => 'publiee',
                'quartier'     => 'Zongo',
                'ville'        => 'Parakou',
            ],
            [
                'titre'        => 'Chambre non meublée Kpébié',
                'description'  => 'Grande chambre lumineuse dans une concession calme. Idéal pour étudiant.',
                'type_chambre' => 'chambre_simple',
                'prix'         => 15000,
                'meublee'      => false,
                'statut'       => 'publiee',
                'quartier'     => 'Kpébié',
                'ville'        => 'Parakou',
            ],
            [
                'titre'        => 'Appartement F2 Madina',
                'description'  => 'Appartement 2 pièces avec salon, chambre, cuisine et douche. Environnement paisible.',
                'type_chambre' => 'appartement',
                'prix'         => 60000,
                'meublee'      => false,
                'statut'       => 'publiee',
                'quartier'     => 'Madina',
                'ville'        => 'Parakou',
            ],
            [
                'titre'        => 'Studio climatisé Titirou',
                'description'  => 'Studio climatisé avec meuble de rangement, lit, bureau. Idéal pour professionnel.',
                'type_chambre' => 'studio',
                'prix'         => 35000,
                'meublee'      => true,
                'statut'       => 'publiee',
                'quartier'     => 'Titirou',
                'ville'        => 'Parakou',
            ],
            [
                'titre'        => 'Grande chambre Albarika',
                'description'  => 'Chambre spacieuse dans villa moderne. Sécurité 24h, parking, groupe électrogène.',
                'type_chambre' => 'chambre_simple',
                'prix'         => 30000,
                'meublee'      => true,
                'statut'       => 'publiee',
                'quartier'     => 'Albarika',
                'ville'        => 'Parakou',
            ],
        ];

        foreach ($annonces as $a) {
            $annonce = Annonce::create([
                'user_id'      => $proprio->id,
                'titre'        => $a['titre'],
                'description'  => $a['description'],
                'type_chambre' => $a['type_chambre'],
                'prix'         => $a['prix'],
                'caution'      => $a['prix'] * 3,
                'meublee'      => $a['meublee'],
                'statut'       => $a['statut'],
                'quartier'     => $a['quartier'],
                'ville'        => $a['ville'],
            ]);

            Localisation::create([
                'annonce_id'       => $annonce->id,
                'latitude'         => 9.3370,
                'longitude'        => 2.6280,
                'adresse_complete' => $a['quartier'] . ', ' . $a['ville'],
            ]);
        }
    }
}