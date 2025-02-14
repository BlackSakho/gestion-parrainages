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
        Schema::create('FichierElectoral', function (Blueprint $table) {
            $table->id();
            $table->string('NomFichier');
            $table->string('Checksum');
            $table->enum('Statut', ['En attente', 'Validé', 'Erreur'])->default('En attente');
            $table->boolean('EtatUploadElecteurs')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('FichierElectoral');
    }
};