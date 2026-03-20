<?php
// routes/api.php
use App\Http\Controllers\Api\Annonce\AnnonceController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Locataire\LocataireController;
use Illuminate\Support\Facades\Route;

// ─── Routes publiques ─────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});
// ─── Routes publiques ANNONCES ────────────────────────────────────────────────
Route::get('/annonces',           [AnnonceController::class, 'index']);  
Route::get('/annonces/{annonce}', [AnnonceController::class, 'show']);   

// ─── Routes authentifiées (token obligatoire) ─────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // ── Routes LOCATAIRE uniquement ──────────────────────────────────────────
    Route::middleware('role:locataire')->prefix('locataire')->group(function () {
        // Les routes locataire seront ajoutées ici progressivement
            Route::post('/demandes',               [LocataireController::class, 'faireDemandeLocation']);
            Route::get('/demandes',                [LocataireController::class, 'mesDemandes']);
            Route::put('/demandes/{id}/annuler',   [LocataireController::class, 'annulerDemande']);
            Route::post('/avis',                   [LocataireController::class, 'laisserAvis']);
    });

    // ── Routes PROPRIÉTAIRE uniquement ───────────────────────────────────────
    Route::middleware(['role:proprietaire', 'proprietaire.verifie'])
        ->prefix('proprietaire')
        ->group(function () {
        // Les routes propriétaire seront ajoutées ici (annonces, etc.)
            Route::get('/annonces',            [AnnonceController::class, 'mesAnnonces']);
            Route::get('/annonces/{annonce}', [AnnonceController::class, 'showMine']);
            Route::post('/annonces',           [AnnonceController::class, 'store']);
            Route::put('/annonces/{annonce}',  [AnnonceController::class, 'update']);
            Route::delete('/annonces/{annonce}', [AnnonceController::class, 'destroy']);

        // Gestion des demandes reçues
            Route::get('/demandes',                    [AnnonceController::class, 'demandesRecues']);
            Route::put('/demandes/{id}/accepter',      [AnnonceController::class, 'accepterDemande']);
            Route::put('/demandes/{id}/refuser',       [AnnonceController::class, 'refuserDemande']);
    });

    // ── Routes ADMIN uniquement ───────────────────────────────────────────────
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Les routes admin seront ajoutées ici
            Route::get('/stats',                               [AdminController::class, 'stats']);
            Route::get('/users',                               [AdminController::class, 'listeUsers']);
            Route::put('/users/{id}/suspendre',                [AdminController::class, 'suspendreUser']);
            Route::put('/users/{id}/reactiver',                [AdminController::class, 'reactiverUser']);
            Route::get('/proprietaires/non-verifies',          [AdminController::class, 'proprietairesNonVerifies']);
            Route::put('/proprietaires/{id}/valider-cni',      [AdminController::class, 'validerCni']);
            Route::get('/annonces/en-attente',                 [AdminController::class, 'annoncesEnAttente']);
            Route::put('/annonces/{id}/publier',               [AdminController::class, 'publierAnnonce']);
            Route::put('/annonces/{id}/suspendre',             [AdminController::class, 'suspendreAnnonce']);
    });

    // ── Routes partagées (locataire + propriétaire) ───────────────────────────
    Route::middleware('role:locataire,proprietaire')->group(function () {
        // Messages, contrats, etc.
    });
});