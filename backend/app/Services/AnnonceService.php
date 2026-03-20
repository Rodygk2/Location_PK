<?php
// app/Services/AnnonceService.php

namespace App\Services;

use App\Models\Annonce;
use App\Models\PhotoAnnonce;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AnnonceService
{
    /**
     * Crée une annonce avec ses photos et sa localisation
     */
    public function creerAnnonce(array $data, array $photos, int $userId): Annonce
    {
        // 1. Calcule automatiquement la caution légale (3 mois de loyer max)
        $data['caution'] = $data['prix'] * 3;
        $data['user_id'] = $userId;
        $data['statut']  = 'en_attente'; // Toujours en attente de validation

        // 2. Crée l'annonce
        $annonce = Annonce::create($data);

        // 3. Crée la localisation
        $annonce->localisation()->create([
            'latitude'         => $data['latitude'],
            'longitude'        => $data['longitude'],
            'adresse_complete' => $data['adresse_complete'] ?? null,
        ]);

        // 4. Upload les photos
        $this->uploadPhotos($annonce, $photos);

        return $annonce->load(['photos', 'localisation']);
    }

    /**
     * Met à jour une annonce
     */
    public function modifierAnnonce(Annonce $annonce, array $data): Annonce
        {
        // Recalcule la caution si le prix change
        if (isset($data['prix'])) {
            $data['caution'] = $data['prix'] * 3;
        }

        // Repasse en attente de validation après modification
        $data['statut'] = 'en_attente';

        $annonce->update($data);

        // Met à jour la localisation si fournie
        if (isset($data['latitude'])) {
            $annonce->localisation()->updateOrCreate(
                ['annonce_id' => $annonce->id],
                [
                    'latitude'         => $data['latitude'],
                    'longitude'        => $data['longitude'],
                    'adresse_complete' => $data['adresse_complete'] ?? null,
                ]
            );
        }

        return $annonce->load(['photos', 'localisation']);
    }

    /**
     * Supprime une annonce et ses fichiers
     */
    public function supprimerAnnonce(Annonce $annonce): void
    {
        // Supprime les fichiers photos du stockage
        foreach ($annonce->photos as $photo) {
            Storage::disk('public')->delete($photo->url);
        }

        $annonce->delete(); // Supprime aussi photos et localisation (cascade)
    }

    /**
     * Upload et enregistre les photos
     */
    private function uploadPhotos(Annonce $annonce, array $photos): void
    {
        foreach ($photos as $index => $photo) {
            // Stocke la photo dans storage/app/public/annonces/
            $path = $photo->store('annonces', 'public');

            PhotoAnnonce::create([
                'annonce_id'    => $annonce->id,
                'url'           => $path,
                'ordre'         => $index,
                'est_principale' => $index === 0, // La 1ère photo est la principale
            ]);
        }
    }
}