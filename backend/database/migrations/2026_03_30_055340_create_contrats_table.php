<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained('demande_location')->onDelete('cascade');
            $table->foreignId('locataire_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('proprietaire_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('annonce_id')->constrained('annonces')->onDelete('cascade');
            $table->enum('statut', ['en_attente_locataire', 'en_attente_proprietaire', 'signe', 'annule'])
                ->default('en_attente_locataire');
            $table->text('signature_locataire')->nullable();  // signature en base64
            $table->text('signature_proprietaire')->nullable();
            $table->timestamp('signe_locataire_le')->nullable();
            $table->timestamp('signe_proprietaire_le')->nullable();
            $table->string('pdf_path')->nullable(); // chemin du PDF final
            $table->decimal('loyer', 10, 2);
            $table->decimal('caution', 10, 2);
            $table->date('date_debut')->nullable();
            $table->string('duree')->default('12 mois');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contrats');
    }
};
