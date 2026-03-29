<?php

namespace App\Http\Controllers\Api\Paiement;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\DemandeLocation;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use FedaPay\FedaPay;
use FedaPay\Transaction;

class PaiementController extends Controller
{
    public function __construct()
    {
        FedaPay::setApiKey(config('services.fedapay.secret_key'));
        FedaPay::setEnvironment(config('services.fedapay.environment'));
    }

    /**
     * Créer une demande de location
     * POST /api/locataire/demandes
     */
    public function creerDemande(Request $request): JsonResponse
    {
        $request->validate([
            'annonce_id'           => ['required', 'exists:annonces,id'],
            'moyen_paiement'       => ['required', 'in:fedapay,especes'],
            'date_entree_souhaitee'=> ['nullable', 'date', 'after:today'],
            'message'              => ['nullable', 'string', 'max:500'],
        ]);

        $annonce = Annonce::findOrFail($request->annonce_id);

        // Vérifier que l'annonce est disponible
        if ($annonce->statut !== 'publiee') {
            return response()->json([
                'success' => false,
                'message' => 'Cette annonce n\'est pas disponible.',
            ], 400);
        }

        // Vérifier que le locataire n'a pas déjà fait une demande
        $demandeExistante = DemandeLocation::where('annonce_id', $request->annonce_id)
            ->where('locataire_id', auth()->id())
            ->where('statut', 'en_attente')
            ->first();

        if ($demandeExistante) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà une demande en attente pour cette annonce.',
            ], 400);
        }

        // Créer la demande
        $demande = DemandeLocation::create([
            'annonce_id'            => $request->annonce_id,
            'locataire_id'          => auth()->id(),
            'moyen_paiement'        => $request->moyen_paiement,
            'date_entree_souhaitee' => $request->date_entree_souhaitee,
            'message'               => $request->message,
        ]);

        // Si paiement FedaPay → créer la transaction
        if ($request->moyen_paiement === 'fedapay') {
            return $this->initierPaiementFedaPay($demande, $annonce);
        }

        // Si espèces → demande créée, en attente de confirmation
        return response()->json([
            'success' => true,
            'message' => 'Demande envoyée avec succès. Le propriétaire va vous contacter.',
            'data'    => ['demande_id' => $demande->id],
        ]);
    }

    /**
     * Initier un paiement FedaPay
     */
    private function initierPaiementFedaPay(DemandeLocation $demande, Annonce $annonce): JsonResponse
    {
        $locataire = auth()->user();
        $montantCaution = $annonce->caution;

        try {
            $transaction = Transaction::create([
                'description' => "Caution - {$annonce->titre}",
                'amount'      => $montantCaution,
                'currency'    => ['iso' => 'XOF'],
                'callback_url'=> config('app.url') . '/api/paiements/webhook',
                'customer'    => [
                    'firstname' => $locataire->prenom,
                    'lastname'  => $locataire->nom,
                    'email'     => $locataire->email,
                    'phone_number' => [
                        'number'  => $locataire->telephone,
                        'country' => 'BJ',
                    ],
                ],
            ]);

            $token = $transaction->generateToken();

            // Sauvegarder le paiement
            Paiement::create([
                'demande_id'            => $demande->id,
                'locataire_id'          => $locataire->id,
                'type'                  => 'caution',
                'montant'               => $montantCaution,
                'moyen'                 => 'fedapay',
                'fedapay_transaction_id'=> $transaction->id,
                'fedapay_token'         => $token->token,
            ]);

            return response()->json([
                'success'      => true,
                'message'      => 'Transaction initiée.',
                'data'         => [
                    'demande_id'    => $demande->id,
                    'payment_url'   => $token->url,
                    'token'         => $token->token,
                ],
            ]);

        } catch (\Exception $e) {
            $demande->delete();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'initiation du paiement : ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Webhook FedaPay — appelé automatiquement après paiement
     * POST /api/paiements/webhook
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();

        if (!isset($payload['id'])) {
            return response()->json(['error' => 'Invalid payload'], 400);
        }

        $paiement = Paiement::where('fedapay_transaction_id', $payload['id'])->first();

        if (!$paiement) {
            return response()->json(['error' => 'Paiement non trouvé'], 404);
        }

        if ($payload['status'] === 'approved') {
            $paiement->update([
                'statut'   => 'complete',
                'paye_le'  => now(),
            ]);

            // Marquer la demande comme acceptée
            $paiement->demande->update(['statut' => 'acceptee']);
        } else {
            $paiement->update(['statut' => 'echoue']);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Mes demandes (locataire)
     * GET /api/locataire/demandes
     */
    public function mesDemandes(): JsonResponse
    {
        $demandes = DemandeLocation::where('locataire_id', auth()->id())
            ->with(['annonce.photos', 'annonce.localisation', 'paiements'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $demandes,
        ]);
    }

    /**
     * Demandes reçues (propriétaire)
     * GET /api/proprietaire/demandes
     */
    public function demandesRecues(): JsonResponse
    {
        $demandes = DemandeLocation::whereHas('annonce', function ($q) {
            $q->where('user_id', auth()->id());
        })
        ->with(['annonce', 'locataire', 'paiements'])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json([
            'success' => true,
            'data'    => $demandes,
        ]);
    }

    /**
     * Historique des paiements
     * GET /api/locataire/paiements
     */
    public function historique(): JsonResponse
    {
        $paiements = Paiement::where('locataire_id', auth()->id())
            ->with(['demande.annonce'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $paiements,
        ]);
    }
}