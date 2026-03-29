<?php
// app/Http/Controllers/Api/Admin/AdminController.php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Liste tous les utilisateurs
     * GET /api/admin/users
     */
    public function listeUsers(): JsonResponse
    {
        $users = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $users,
        ]);
    }

    /**
     * Liste les propriétaires en attente de vérification CNI
     * GET /api/admin/proprietaires/non-verifies
     */
    public function proprietairesNonVerifies(): JsonResponse
    {
        $proprietaires = User::role('proprietaire')
            ->where('cni_verifie', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $proprietaires,
        ]);
    }

    /**
     * Valider la CNI d'un propriétaire
     * PUT /api/admin/proprietaires/{id}/valider-cni
     */
    public function validerCni(int $id): JsonResponse
    {
        $proprietaire = User::role('proprietaire')->findOrFail($id);

        $proprietaire->update(['cni_verifie' => true]);

        return response()->json([
            'success' => true,
            'message' => "CNI de {$proprietaire->prenom} {$proprietaire->nom} validée.",
            'data'    => $proprietaire,
        ]);
    }

    /**
     * Suspendre un utilisateur
     * PUT /api/admin/users/{id}/suspendre
     */
    public function suspendreUser(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Empêche de suspendre un admin
        if ($user->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de suspendre un administrateur.',
            ], 403);
        }

        $user->update(['statut' => 'suspendu']);

        return response()->json([
            'success' => true,
            'message' => "Compte de {$user->prenom} {$user->nom} suspendu.",
        ]);
    }

    /**
     * Réactiver un utilisateur suspendu
     * PUT /api/admin/users/{id}/reactiver
     */
    public function reactiverUser(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->update(['statut' => 'actif']);

        return response()->json([
            'success' => true,
            'message' => "Compte de {$user->prenom} {$user->nom} réactivé.",
        ]);
    }

    /**
     * Liste des annonces en attente de validation
     * GET /api/admin/annonces/en-attente
     */
    public function annoncesEnAttente(): JsonResponse
    {
        $annonces = Annonce::with(['proprietaire', 'photos', 'localisation'])
            ->where('statut', 'en_attente')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $annonces,
        ]);
    }

    /**
     * Publier une annonce
     * PUT /api/admin/annonces/{id}/publier
     */
    public function publierAnnonce(int $id): JsonResponse
    {
        $annonce = Annonce::findOrFail($id);
        $annonce->update(['statut' => 'publiee']);

        return response()->json([
            'success' => true,
            'message' => "Annonce \"{$annonce->titre}\" publiée avec succès.",
        ]);
    }

    /**
     * Suspendre une annonce
     * PUT /api/admin/annonces/{id}/suspendre
     */
    public function suspendreAnnonce(int $id): JsonResponse
    {
        $annonce = Annonce::findOrFail($id);
        $annonce->update(['statut' => 'suspendue']);

        return response()->json([
            'success' => true,
            'message' => "Annonce \"{$annonce->titre}\" suspendue.",
        ]);
    }

    /**
     * Statistiques globales
     * GET /api/admin/statistiques
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'total_users'          => User::count(),
                'total_locataires'     => User::role('locataire')->count(),
                'total_proprietaires'  => User::role('proprietaire')->count(),
                'proprietaires_non_verifies' => User::role('proprietaire')
                                                ->where('cni_verifie', false)->count(),
                'cni_non_verifies'    => \App\Models\User::where('cni_verifie', false)
                                        ->whereNotNull('cni_path') // ← ajoute cette ligne
                                        ->role('proprietaire')
                                        ->count(),
                'total_annonces'       => Annonce::count(),
                'annonces_en_attente'  => Annonce::where('statut', 'en_attente')->count(),
                'annonces_publiees'    => Annonce::where('statut', 'publiee')->count(),
                'annonces_louees'      => Annonce::where('statut', 'louee')->count(),
            ],
        ]);
        
    }

    public function voirCni($id)
    {
        $user = \App\Models\User::findOrFail($id);

        if (!$user->cni_path) {
            abort(404, 'Aucune CNI soumise.');
        }

        $path = storage_path('app/public/' . $user->cni_path);

        if (!\File::exists($path)) {
            abort(404, 'Fichier introuvable.');
        }

        $mime = \File::mimeType($path);

        return response()->file($path, [
            'Content-Type' => $mime,
            'Access-Control-Allow-Origin' => '*',
        ]);
    }
}