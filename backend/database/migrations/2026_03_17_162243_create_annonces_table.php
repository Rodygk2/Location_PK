<?php
// database/migrations/xxxx_create_annonces_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('annonces', function (Blueprint $table) {
            $table->id();

            // Propriétaire de l'annonce
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade'); // ← Si le propriétaire est supprimé, ses annonces aussi

            $table->string('titre');
            $table->text('description');

            // Prix et conditions
            $table->decimal('prix', 10, 2);         // Ex: 25000.00 FCFA
            $table->decimal('caution', 10, 2);       // Calculée automatiquement
            $table->enum('periodicite', ['mensuel', 'annuel'])->default('mensuel');

            // Localisation
            $table->string('quartier');
            $table->string('ville')->default('Parakou');

            // Caractéristiques
            $table->enum('type_chambre', [
                'chambre_simple',
                'chambre_salon',
                'appartement',
                'studio'
            ]);
            $table->integer('nombre_pieces')->default(1);
            $table->boolean('meublee')->default(false);
            $table->boolean('eau_incluse')->default(false);
            $table->boolean('electricite_incluse')->default(false);

            // Statut de l'annonce
            $table->enum('statut', [
                'en_attente',   // Soumise, en attente de modération admin
                'publiee',      // Validée et visible par tous
                'louee',        // Chambre déjà louée
                'suspendue'     // Suspendue par l'admin
            ])->default('en_attente');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('annonces');
    }
};