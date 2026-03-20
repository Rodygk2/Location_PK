<?php
// database/migrations/xxxx_create_photo_annonces_table.php
use Illuminate\Database\Migrations\Migration; 
use Illuminate\Database\Schema\Blueprint;     
use Illuminate\Support\Facades\Schema;        
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photo_annonces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('annonce_id')
                  ->constrained()
                  ->onDelete('cascade'); // ← Photos supprimées avec l'annonce
            $table->string('url');           // Chemin du fichier stocké
            $table->integer('ordre')->default(0); // Pour ordonner les photos
            $table->boolean('est_principale')->default(false); // Photo de couverture
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photo_annonces');
    }
};