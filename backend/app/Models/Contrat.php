<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    protected $fillable = [
        'demande_id', 'locataire_id', 'proprietaire_id', 'annonce_id',
        'statut', 'signature_locataire', 'signature_proprietaire',
        'signe_locataire_le', 'signe_proprietaire_le', 'pdf_path',
        'loyer', 'caution', 'date_debut', 'duree',
    ];

    protected $casts = [
        'signe_locataire_le'    => 'datetime',
        'signe_proprietaire_le' => 'datetime',
    ];

    public function demande()
    {
        return $this->belongsTo(DemandeLocation::class, 'demande_id');
    }

    public function locataire()
    {
        return $this->belongsTo(User::class, 'locataire_id');
    }

    public function proprietaire()
    {
        return $this->belongsTo(User::class, 'proprietaire_id');
    }

    public function annonce()
    {
        return $this->belongsTo(Annonce::class);
    }
}