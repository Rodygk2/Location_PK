<?php
// app/Http/Middleware/CheckRole.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Vérifie si l'utilisateur est connecté
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié.',
            ], 401);
        }

        // Vérifie si l'utilisateur a l'un des rôles requis
        foreach ($roles as $role) {
            if ($request->user()->hasRole($role)) {
                return $next($request); // ← Autorisé, on continue
            }
        }

        // Aucun rôle correspondant → accès refusé
        return response()->json([
            'success' => false,
            'message' => 'Accès refusé. Vous n\'avez pas les droits nécessaires.',
        ], 403);
    }
}