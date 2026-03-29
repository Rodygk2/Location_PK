<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeLocation extends Model
{
    protected $table = 'demande_location';

    protected $fillable = [
        'annonce_id', 'locataire_id', 'statut',
        'moyen_paiement', 'date_entree_souhaitee', 'message',
    ];

    public function annonce(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }

    public function locataire(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'locataire_id');
    }

    public function paiements(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Paiement::class, 'demande_id');
    }
}