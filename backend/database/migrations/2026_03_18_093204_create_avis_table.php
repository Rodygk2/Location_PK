<?php
// database/migrations/xxxx_create_avis_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avis', function (Blueprint $table) {
            $table->id();

            $table->foreignId('annonce_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->foreignId('locataire_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->integer('note')->between(1, 5); // Note de 1 à 5
            $table->text('commentaire')->nullable();
            $table->timestamps();

            // Un locataire ne peut laisser qu'un seul avis par annonce
            $table->unique(['annonce_id', 'locataire_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avis');
    }
};