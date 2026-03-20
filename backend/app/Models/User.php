<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens;  // ← Sanctum : gestion des tokens
    use HasFactory;
    use Notifiable;
    use HasRoles;      // ← Spatie : gestion des rôles

    // Champs qu'on peut remplir en masse
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'password',
        'cni_path',        // Photo de la CNI (pour propriétaires)
        'cni_verifie',     // Vérifié par l'admin (true/false)
    ];

    // Champs cachés (jamais envoyés dans les réponses JSON)
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Conversions automatiques de types
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',    // ← Hash automatique du mot de passe
            'cni_verifie' => 'boolean',
        ];
    }
}