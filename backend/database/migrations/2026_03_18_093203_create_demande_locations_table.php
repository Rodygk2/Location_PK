<?php
// database/migrations/xxxx_create_demande_locations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demande_locations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('annonce_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->foreignId('locataire_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->enum('statut', [
                'en_attente',  // Demande envoyée, pas encore traitée
                'acceptee',    // Propriétaire a accepté
                'refusee',     // Propriétaire a refusé
                'annulee',     // Locataire a annulé
            ])->default('en_attente');

            $table->text('message')->nullable(); // Message du locataire
            $table->date('date_souhaitee')->nullable(); // Date d'entrée souhaitée
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demande_locations');
    }
};