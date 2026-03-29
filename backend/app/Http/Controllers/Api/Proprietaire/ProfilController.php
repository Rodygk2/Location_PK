<?php

namespace App\Http\Controllers\Api\Proprietaire;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProfilController extends Controller
{
    /**
     * Voir son profil
     * GET /api/proprietaire/profil
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'id'          => $user->id,
                'nom'         => $user->nom,
                'prenom'      => $user->prenom,
                'email'       => $user->email,
                'telephone'   => $user->telephone,
                'cni_verifie' => $user->cni_verifie,
                'cni_path'    => $user->cni_path,
                'statut'      => $user->statut,
            ],
        ]);
    }

    /**
     * Uploader sa CNI
     * POST /api/proprietaire/profil/cni
     */
    public function uploadCni(Request $request): JsonResponse
    {
        $request->validate([
            'cni' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        $user = $request->user();

        // Supprimer l'ancienne CNI si elle existe
        if ($user->cni_path) {
            \Storage::disk('public')->delete($user->cni_path);
        }

        // Stocker la nouvelle CNI
        $path = $request->file('cni')->store('cni', 'public');

        // Mettre à jour l'utilisateur
        $user->update([
            'cni_path'    => $path,
            'cni_verifie' => false, // repasse en attente de vérification
        ]);

        return response()->json([
            'success' => true,
            'message' => 'CNI soumise avec succès. En attente de validation.',
            'data'    => ['cni_path' => $path],
        ]);
    }

    public function updateProfil(Request $request): JsonResponse
    {
        $request->validate([
            'nom'       => ['required', 'string', 'max:255'],
            'prenom'    => ['required', 'string', 'max:255'],
            'telephone' => ['required', 'string', 'max:20'],
        ]);

        $user = $request->user();
        $user->update([
            'nom'       => $request->nom,
            'prenom'    => $request->prenom,
            'telephone' => $request->telephone,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès.',
        ]);
    }
}