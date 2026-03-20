<?php
// database/migrations/xxxx_create_localisations_table.php
use Illuminate\Database\Migrations\Migration; 
use Illuminate\Database\Schema\Blueprint;     
use Illuminate\Support\Facades\Schema;    


return new class extends Migration
{
    public function up(): void
    {
        Schema::create('localisations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('annonce_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->decimal('latitude', 10, 7);   // Ex: 9.3376800
            $table->decimal('longitude', 10, 7);  // Ex: 2.6205300
            $table->string('adresse_complete')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('localisations');
    }
};