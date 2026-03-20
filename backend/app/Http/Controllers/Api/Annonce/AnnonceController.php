<?php
// app/Http/Controllers/Api/Annonce/AnnonceController.php

namespace App\Http\Controllers\Api\Annonce;

use App\Http\Controllers\Controller;
use App\Http\Requests\Annonce\StoreAnnonceRequest;
use App\Http\Requests\Annonce\UpdateAnnonceRequest;
use App\Models\Annonce;
use App\Services\AnnonceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\DemandeLocation;

class AnnonceController extends Controller
{
    public function __construct(
        private AnnonceService $annonceService
    ) {}

    /**
     * Liste publique des annonces publiées avec filtres
     * GET /api/annonces
     */
    public function index(Request $request): JsonResponse
    {
        $query = Annonce::with(['photoPrincipale', 'localisation', 'proprietaire'])
                        ->where('statut', 'publiee');

        // ── Filtres ──────────────────────────────────────────────────────────
        if ($request->filled('quartier')) {
            $query->where('quartier', 'like', '%' . $request->quartier . '%');
        }

        if ($request->filled('ville')) {
            $query->where('ville', $request->ville);
        }

        if ($request->filled('type_chambre')) {
            $query->where('type_chambre', $request->type_chambre);
        }

        if ($request->filled('prix_min')) {
            $query->where('prix', '>=', $request->prix_min);
        }

        if ($request->filled('prix_max')) {
            $query->where('prix', '<=', $request->prix_max);
        }

        if ($request->filled('meublee')) {
            $query->where('meublee', filter_var($request->meublee, FILTER_VALIDATE_BOOLEAN));
        }

        // ── Tri ──────────────────────────────────────────────────────────────
        $query->orderBy('created_at', 'desc');

        // ── Pagination ───────────────────────────────────────────────────────
        $annonces = $query->paginate(12);

        return response()->json([
            'success' => true,
            'data'    => $annonces,
        ]);
    }

    /**
     * Détail d'une annonce
     * GET /api/annonces/{id}
     */
public function show(Annonce $annonce): JsonResponse
{
    $user = auth()->user();

    // Propriétaire peut voir sa propre annonce quel que soit le statut
    // Locataire ne peut voir que les annonces publiées
    if ($annonce->statut !== 'publiee' && $annonce->user_id !== $user?->id) {
        return response()->json([
            'success' => false,
            'message' => 'Cette annonce n\'est pas disponible.',
        ], 404);
    }

    $annonce->load(['photos', 'localisation', 'proprietaire']);

    return response()->json([
        'success' => true,
        'data'    => $annonce,
    ]);
}

    /**
     * Annonces du propriétaire connecté
     * GET /api/proprietaire/annonces
     */
    public function mesAnnonces(Request $request): JsonResponse
    {
        $annonces = Annonce::with(['photoPrincipale', 'localisation'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $annonces,
        ]);
    }

    /**
     * Créer une annonce
     * POST /api/proprietaire/annonces
     */
    public function store(StoreAnnonceRequest $request): JsonResponse
    {
        $annonce = $this->annonceService->creerAnnonce(
            data:   $request->except('photos'),
            photos: $request->file('photos'),
            userId: $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Annonce créée avec succès. Elle sera visible après validation.',
            'data'    => $annonce,
        ], 201);
    }

    /**
     * Modifier une annonce
     * PUT /api/proprietaire/annonces/{id}
     */
    public function update(UpdateAnnonceRequest $request, Annonce $annonce): JsonResponse
    {
        // Vérifie que l'annonce appartient bien au propriétaire connecté
        if ($annonce->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas autorisé à modifier cette annonce.',
            ], 403);
        }

        $annonce = $this->annonceService->modifierAnnonce(
            annonce: $annonce,
            data:    $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Annonce modifiée. Elle repassera en validation.',
            'data'    => $annonce,
        ]);
    }

    /**
     * Supprimer une annonce
     * DELETE /api/proprietaire/annonces/{id}
     */
    public function destroy(Request $request, Annonce $annonce): JsonResponse
    {
        if ($annonce->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas autorisé à supprimer cette annonce.',
            ], 403);
        }

        $this->annonceService->supprimerAnnonce($annonce);

        return response()->json([
            'success' => true,
            'message' => 'Annonce supprimée avec succès.',
        ]);
    }

    /**
 * Détail d'une annonce du propriétaire connecté
 * GET /api/proprietaire/annonces/{id}
 */
public function showMine(Annonce $annonce): JsonResponse
{
    // Vérifier que l'annonce appartient au propriétaire connecté
    if ($annonce->user_id !== auth()->id()) {
        return response()->json([
            'success' => false,
            'message' => 'Cette annonce ne vous appartient pas.',
        ], 403);
    }

    $annonce->load(['photos', 'localisation', 'proprietaire']);

    return response()->json([
        'success' => true,
        'data'    => $annonce,
    ]);
}

    /**
     * Demandes reçues par le propriétaire
     * GET /api/proprietaire/demandes
     */
    public function demandesRecues(Request $request): JsonResponse
    {
        $demandes = DemandeLocation::with(['annonce', 'locataire'])
            ->whereHas('annonce', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $demandes,
        ]);
    }

    /**
     * Accepter une demande de location
     * PUT /api/proprietaire/demandes/{id}/accepter
     */
    public function accepterDemande(Request $request, int $id): JsonResponse
    {
        $demande = DemandeLocation::whereHas('annonce', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($id);

        $demande->update(['statut' => 'acceptee']);

        // Marque l'annonce comme louée
        $demande->annonce->update(['statut' => 'louee']);

        return response()->json([
            'success' => true,
            'message' => 'Demande acceptée. L\'annonce est maintenant marquée comme louée.',
        ]);
    }

    /**
     * Refuser une demande de location
     * PUT /api/proprietaire/demandes/{id}/refuser
     */
    public function refuserDemande(Request $request, int $id): JsonResponse
    {
        $demande = DemandeLocation::whereHas('annonce', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($id);

        $demande->update(['statut' => 'refusee']);

        return response()->json([
            'success' => true,
            'message' => 'Demande refusée.',
        ]);
    }
}