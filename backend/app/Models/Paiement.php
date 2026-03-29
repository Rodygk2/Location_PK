<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $fillable = [
        'demande_id', 'locataire_id', 'type', 'montant',
        'statut', 'moyen', 'fedapay_transaction_id',
        'fedapay_token', 'paye_le',
    ];

    protected $casts = [
        'paye_le' => 'datetime',
    ];

    public function demande(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(DemandeLocation::class, 'demande_id');
    }

    public function locataire(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'locataire_id');
    }
}