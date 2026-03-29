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
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained('demandes_location')->onDelete('cascade');
            $table->foreignId('locataire_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['caution', 'loyer', 'frais_dossier']);
            $table->decimal('montant', 10, 2);
            $table->enum('statut', ['en_attente', 'complete', 'echoue'])->default('en_attente');
            $table->enum('moyen', ['fedapay', 'especes']);
            $table->string('fedapay_transaction_id')->nullable();
            $table->string('fedapay_token')->nullable();
            $table->timestamp('paye_le')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
