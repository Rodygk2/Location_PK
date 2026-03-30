<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        \DB::statement("ALTER TABLE demande_location MODIFY COLUMN statut ENUM('en_attente', 'acceptee', 'refusee', 'annulee') DEFAULT 'en_attente'");
    }

    public function down(): void
    {
        \DB::statement("ALTER TABLE demande_location MODIFY COLUMN statut ENUM('en_attente', 'acceptee', 'refusee') DEFAULT 'en_attente'");
    }
};
