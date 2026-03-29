<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Supprimer la table en doublon
        Schema::dropIfExists('demande_locations');

        // Renommer la bonne table
        Schema::rename('demandes_location', 'demande_location');
    }

    public function down(): void
    {
        Schema::rename('demande_location', 'demandes_location');
        // Ne recrée pas demande_locations — c'était un doublon
    }
};