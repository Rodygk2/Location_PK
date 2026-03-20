<?php
// app/Http/Controllers/Api/Auth/AuthController.php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * INSCRIPTION
     * POST /api/auth/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // 1. Crée l'utilisateur avec les données validées
        $user = User::create([
            'nom'       => $request->nom,
            'prenom'    => $request->prenom,
            'email'     => $request->email,
            'telephone' => $request->telephone,
            'password'  => $request->password, // hashé automatiquement
        ]);

        // 2. Assigne le rôle choisi (locataire ou proprietaire)
        $user->assignRole($request->role);

        // 3. Génère un token d'accès
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Retourne la réponse JSON
        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie.',
            'data'    => [
                'user'  => $this->formatUser($user),
                'token' => $token,
            ],
        ], 201); // 201 = Created
    }

    /**
     * CONNEXION
     * POST /api/auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // 1. Vérifie les credentials
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect.',
            ], 401); // 401 = Unauthorized
        }

        // 2. Récupère l'utilisateur
        $user = Auth::user();

        // 3. Vérifie si le compte est actif
        if ($user->statut === 'suspendu') {
            return response()->json([
                'success' => false,
                'message' => 'Votre compte a été suspendu. Contactez l\'administrateur.',
            ], 403); // 403 = Forbidden
        }

        // 4. Supprime les anciens tokens et crée un nouveau
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'data'    => [
                'user'  => $this->formatUser($user),
                'token' => $token,
            ],
        ]);
    }

    /**
     * DÉCONNEXION
     * POST /api/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        // Supprime le token actuel
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.',
        ]);
    }

    /**
     * PROFIL CONNECTÉ
     * GET /api/auth/me
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->formatUser($request->user()),
        ]);
    }

    /**
     * Formate les données utilisateur pour la réponse JSON
     * Méthode privée réutilisable dans ce controller
     */
    private function formatUser(User $user): array
    {
        return [
            'id'          => $user->id,
            'nom'         => $user->nom,
            'prenom'      => $user->prenom,
            'email'       => $user->email,
            'telephone'   => $user->telephone,
            'role'        => $user->getRoleNames()->first(), // ← Récupère le rôle via Spatie
            'cni_verifie' => $user->cni_verifie,
            'statut'      => $user->statut,
            'created_at'  => $user->created_at->format('d/m/Y'),
        ];
    }

}