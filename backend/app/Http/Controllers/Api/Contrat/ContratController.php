<?php

namespace App\Http\Controllers\Api\Contrat;

use App\Http\Controllers\Controller;
use App\Models\Contrat;
use App\Models\DemandeLocation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Barryvdh\DomPDF\Facade\Pdf;

class ContratController extends Controller
{
    /**
     * Générer un contrat après paiement
     * POST /api/contrats/generer/{demande_id}
     */
    public function generer($demandeId): JsonResponse
    {
        $demande = DemandeLocation::with(['annonce.proprietaire', 'locataire'])
            ->findOrFail($demandeId);

        // Vérifier qu'un contrat n'existe pas déjà
        $existant = Contrat::where('demande_id', $demandeId)->first();
        if ($existant) {
            return response()->json([
                'success' => true,
                'message' => 'Contrat déjà existant.',
                'data'    => $existant,
            ]);
        }

        $annonce     = $demande->annonce;
        $proprietaire = $annonce->proprietaire;

        $contrat = Contrat::create([
            'demande_id'       => $demande->id,
            'locataire_id'     => $demande->locataire_id,
            'proprietaire_id'  => $proprietaire->id,
            'annonce_id'       => $annonce->id,
            'loyer'            => $annonce->prix,
            'caution'          => $annonce->caution,
            'date_debut'       => $demande->date_entree_souhaitee ?? now()->addDays(7),
            'duree'            => '12 mois',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contrat généré avec succès.',
            'data'    => $contrat->load(['locataire', 'proprietaire', 'annonce']),
        ]);
    }

    /**
     * Signer le contrat
     * POST /api/contrats/{id}/signer
     */
    public function signer(Request $request, $id): JsonResponse
    {
        $request->validate([
            'signature' => ['required', 'string'], // base64
        ]);

        $contrat = Contrat::findOrFail($id);
        $user    = auth()->user();

        // Signature du locataire
        if ($user->id === $contrat->locataire_id) {
            if ($contrat->signature_locataire) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous avez déjà signé ce contrat.',
                ], 400);
            }
            $contrat->update([
                'signature_locataire'  => $request->signature,
                'signe_locataire_le'   => now(),
                'statut'               => 'en_attente_proprietaire',
            ]);
        }

        // Signature du propriétaire
        elseif ($user->id === $contrat->proprietaire_id) {
            if ($contrat->signature_proprietaire) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous avez déjà signé ce contrat.',
                ], 400);
            }
            $contrat->update([
                'signature_proprietaire'  => $request->signature,
                'signe_proprietaire_le'   => now(),
                'statut'                  => 'signe',
            ]);

            // Générer le PDF final
            $this->genererPdf($contrat);
        }

        else {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas autorisé à signer ce contrat.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Contrat signé avec succès.',
            'data'    => $contrat->fresh()->load(['locataire', 'proprietaire', 'annonce']),
        ]);
    }

    /**
     * Télécharger le PDF du contrat
     * GET /api/contrats/{id}/pdf
     */
    public function telecharger($id)
    {
        $contrat = Contrat::with(['locataire', 'proprietaire', 'annonce'])
            ->findOrFail($id);

        $user = auth()->user();

        // Vérifier que l'utilisateur est concerné
        if ($user->id !== $contrat->locataire_id && $user->id !== $contrat->proprietaire_id) {
            abort(403);
        }

        $pdf = Pdf::loadView('contrats.contrat', ['contrat' => $contrat]);

        return $pdf->download("contrat_{$contrat->id}.pdf");
    }

    /**
     * Voir un contrat
     * GET /api/contrats/{id}
     */
    public function show($id): JsonResponse
    {
        $contrat = Contrat::with(['locataire', 'proprietaire', 'annonce'])
            ->findOrFail($id);

        $user = auth()->user();

        if ($user->id !== $contrat->locataire_id && $user->id !== $contrat->proprietaire_id) {
            abort(403);
        }

        return response()->json([
            'success' => true,
            'data'    => $contrat,
        ]);
    }

    /**
     * Mes contrats
     * GET /api/contrats
     */
    public function mesContrats(): JsonResponse
    {
        $user = auth()->user();

        $contrats = Contrat::with(['locataire', 'proprietaire', 'annonce'])
            ->where('locataire_id', $user->id)
            ->orWhere('proprietaire_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $contrats,
        ]);
    }

    /**
     * Générer le PDF du contrat
     */
    private function genererPdf(Contrat $contrat): void
    {
        $contrat->load(['locataire', 'proprietaire', 'annonce']);
        $pdf  = Pdf::loadView('contrats.contrat', ['contrat' => $contrat]);
        $path = "contrats/contrat_{$contrat->id}.pdf";
        \Storage::disk('public')->put($path, $pdf->output());
        $contrat->update(['pdf_path' => $path]);
    }
}