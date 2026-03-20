<?php
// app/Models/PhotoAnnonce.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PhotoAnnonce extends Model
{
    protected $fillable = [
        'annonce_id',
        'url',
        'ordre',
        'est_principale',
    ];

    protected function casts(): array
    {
        return [
            'est_principale' => 'boolean',
        ];
    }

    public function annonce(): BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }
}