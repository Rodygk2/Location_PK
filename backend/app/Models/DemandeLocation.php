<?php
// app/Models/DemandeLocation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DemandeLocation extends Model
{
    protected $table = 'demande_locations';

    protected $fillable = [
        'annonce_id',
        'locataire_id',
        'statut',
        'message',
        'date_souhaitee',
    ];

    protected function casts(): array
    {
        return [
            'date_souhaitee' => 'date',
        ];
    }

    // Relations
    public function annonce(): BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }

    public function locataire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'locataire_id');
    }
}