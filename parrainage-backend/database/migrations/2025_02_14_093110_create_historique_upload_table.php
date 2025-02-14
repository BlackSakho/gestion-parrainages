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
        Schema::create('HistoriqueUpload', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('UtilisateurID'); // ID de l'utilisateur
            $table->string('AdresseIP'); // IP de l'utilisateur
            $table->timestamp('DateUpload')->useCurrent(); // Date de l'upload
            $table->string('ClefUtilisee'); // Valeur de la clé utilisée
            $table->timestamps();

            $table->foreign('UtilisateurID')->references('id')->on('users')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('HistoriqueUpload');
    }
};