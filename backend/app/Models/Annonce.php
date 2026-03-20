<?php
// app/Models/Annonce.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Annonce extends Model
{
    protected $fillable = [
        'user_id',
        'titre',
        'description',
        'prix',
        'caution',
        'periodicite',
        'quartier',
        'ville',
        'type_chambre',
        'nombre_pieces',
        'meublee',
        'eau_incluse',
        'electricite_incluse',
        'statut',
    ];

    protected function casts(): array
    {
        return [
            'meublee'              => 'boolean',
            'eau_incluse'          => 'boolean',
            'electricite_incluse'  => 'boolean',
            'prix'                 => 'decimal:2',
            'caution'              => 'decimal:2',
        ];
    }

    // ─── Relations ────────────────────────────────────────────────────────────

    // Une annonce appartient à un propriétaire
    public function proprietaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Une annonce a plusieurs photos
    public function photos(): HasMany
    {
        return $this->hasMany(PhotoAnnonce::class);
    }

    // Une annonce a une localisation
    public function localisation(): HasOne
    {
        return $this->hasOne(Localisation::class);
    }

    // Photo principale uniquement
    public function photoPrincipale(): HasOne
    {
        return $this->hasOne(PhotoAnnonce::class)
                    ->where('est_principale', true);
    }

    // Une annonce a plusieurs demandes 
        public function demandes(): HasMany
    {
        return $this->hasMany(DemandeLocation::class);
    }

    //Une annonce a plusieurs avis
    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class);
    }
}