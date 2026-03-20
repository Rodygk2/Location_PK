<?php
// app/Http/Middleware/CheckProprietaireVerifie.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckProprietaireVerifie
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Seuls les propriétaires sont concernés par cette vérification
        if ($user->hasRole('proprietaire') && !$user->cni_verifie) {
            return response()->json([
                'success' => false,
                'message' => 'Votre identité n\'a pas encore été vérifiée. '
                           . 'Veuillez soumettre votre CNI et attendre la validation.',
            ], 403);
        }

        return $next($request);
    }
}