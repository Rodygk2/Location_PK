<?php
// routes/api.php
use App\Http\Controllers\Api\Annonce\AnnonceController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Locataire\LocataireController;
use App\Http\Controllers\Api\Proprietaire\ProfilController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Paiement\PaiementController;
use App\Http\Controllers\Api\Contrat\ContratController;



// Webhook — public (appelé par FedaPay)
Route::post('/paiements/webhook', [PaiementController::class, 'webhook']);



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
    Route::middleware(['auth:sanctum', 'role:locataire'])->prefix('locataire')->group(function () {
        // Les routes locataire seront ajoutées ici progressivement
            Route::post('/demandes',               [LocataireController::class, 'faireDemandeLocation']);
            Route::get('/demandes',                [LocataireController::class, 'mesDemandes']);
            Route::put('/demandes/{id}/annuler',   [LocataireController::class, 'annulerDemande']);
            Route::post('/avis',                   [LocataireController::class, 'laisserAvis']);

            Route::post('/demandes', [PaiementController::class, 'creerDemande']);
            Route::get('/demandes', [PaiementController::class, 'mesDemandes']);
            Route::get('/paiements', [PaiementController::class, 'historique']);
    });

    Route::middleware(['auth:sanctum', 'role:proprietaire'])
    ->prefix('proprietaire')
    ->group(function () {
        // Profil — accessible même sans CNI vérifiée
        Route::get('/profil', [ProfilController::class, 'show']);
        Route::put('/profil', [ProfilController::class, 'updateProfil']);
        Route::post('/profil/cni', [ProfilController::class, 'uploadCni']);
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
            Route::get('/proprietaires/{id}/cni',              [AdminController::class, 'voirCni']);
    });

    // ── Routes partagées (locataire + propriétaire) ───────────────────────────
    Route::middleware('role:locataire,proprietaire')->group(function () {
        // Messages, contrats, etc.
    });
    //Routes relatif au contrat entre les deux parties
    Route::middleware(['auth:sanctum'])
    ->prefix('contrats')
    ->group(function () {
        Route::get('/', [ContratController::class, 'mesContrats']);
        Route::get('/{id}', [ContratController::class, 'show']);
        Route::post('/generer/{demande_id}', [ContratController::class, 'generer']);
        Route::post('/{id}/signer', [ContratController::class, 'signer']);
        Route::get('/{id}/pdf', [ContratController::class, 'telecharger']);
    });
});