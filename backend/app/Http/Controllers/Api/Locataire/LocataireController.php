<?php
// app/Http/Controllers/Api/Locataire/LocataireController.php

namespace App\Http\Controllers\Api\Locataire;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\Avis;
use App\Models\DemandeLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocataireController extends Controller
{
    /**
     * Faire une demande de location
     * POST /api/locataire/demandes
     */
    public function faireDemandeLocation(Request $request): JsonResponse
    {
        $request->validate([
            'annonce_id'     => ['required', 'exists:annonces,id'],
            'message'        => ['nullable', 'string', 'max:500'],
            'date_souhaitee' => ['nullable', 'date', 'after:today'],
        ], [
            'annonce_id.exists'       => 'Cette annonce n\'existe pas.',
            'date_souhaitee.after'    => 'La date doit être dans le futur.',
        ]);

        // Vérifie que l'annonce est disponible
        $annonce = Annonce::findOrFail($request->annonce_id);

        if ($annonce->statut !== 'publiee') {
            return response()->json([
                'success' => false,
                'message' => 'Cette annonce n\'est pas disponible.',
            ], 422);
        }

        // Vérifie qu'il n'y a pas déjà une demande en cours
        $demandeExistante = DemandeLocation::where('annonce_id', $request->annonce_id)
            ->where('locataire_id', $request->user()->id)
            ->whereIn('statut', ['en_attente', 'acceptee'])
            ->first();

        if ($demandeExistante) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà une demande en cours pour cette annonce.',
            ], 422);
        }

        $demande = DemandeLocation::create([
            'annonce_id'     => $request->annonce_id,
            'locataire_id'   => $request->user()->id,
            'message'        => $request->message,
            'date_souhaitee' => $request->date_souhaitee,
            'statut'         => 'en_attente',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Demande envoyée avec succès. Le propriétaire vous contactera.',
            'data'    => $demande->load('annonce'),
        ], 201);
    }

    /**
     * Voir mes demandes de location
     * GET /api/locataire/demandes
     */
    public function mesDemandes(Request $request): JsonResponse
    {
        $demandes = DemandeLocation::with(['annonce.photoPrincipale', 'annonce.proprietaire'])
            ->where('locataire_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $demandes,
        ]);
    }

    /**
     * Annuler une demande
     * PUT /api/locataire/demandes/{id}/annuler
     */
    public function annulerDemande(Request $request, int $id): JsonResponse
    {
        $demande = DemandeLocation::where('locataire_id', $request->user()->id)
            ->findOrFail($id);

        if ($demande->statut !== 'en_attente') {
            return response()->json([
                'success' => false,
                'message' => 'Seules les demandes en attente peuvent être annulées.',
            ], 422);
        }

        $demande->update(['statut' => 'annulee']);

        return response()->json([
            'success' => true,
            'message' => 'Demande annulée avec succès.',
        ]);
    }

    /**
     * Laisser un avis sur une annonce
     * POST /api/locataire/avis
     */
    public function laisserAvis(Request $request): JsonResponse
    {
        $request->validate([
            'annonce_id'  => ['required', 'exists:annonces,id'],
            'note'        => ['required', 'integer', 'min:1', 'max:5'],
            'commentaire' => ['nullable', 'string', 'max:500'],
        ], [
            'note.min' => 'La note minimum est 1.',
            'note.max' => 'La note maximum est 5.',
        ]);

        // Vérifie que le locataire a bien eu une demande acceptée
        $demandeAcceptee = DemandeLocation::where('annonce_id', $request->annonce_id)
            ->where('locataire_id', $request->user()->id)
            ->where('statut', 'acceptee')
            ->first();

        if (!$demandeAcceptee) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez laisser un avis que si votre demande a été acceptée.',
            ], 403);
        }

        // Vérifie qu'il n'a pas déjà laissé un avis
        $avisExistant = Avis::where('annonce_id', $request->annonce_id)
            ->where('locataire_id', $request->user()->id)
            ->first();

        if ($avisExistant) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà laissé un avis pour cette annonce.',
            ], 422);
        }

        $avis = Avis::create([
            'annonce_id'  => $request->annonce_id,
            'locataire_id'=> $request->user()->id,
            'note'        => $request->note,
            'commentaire' => $request->commentaire,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Avis publié avec succès.',
            'data'    => $avis,
        ], 201);
    }
}