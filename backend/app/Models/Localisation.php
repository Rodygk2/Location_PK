<?php
// app/Models/Localisation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Localisation extends Model
{
    protected $fillable = [
        'annonce_id',
        'latitude',
        'longitude',
        'adresse_complete',
    ];

    public function annonce(): BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }
}