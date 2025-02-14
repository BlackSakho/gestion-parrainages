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
        Schema::create('ElecteursProblematiques', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('IDFichier'); // ✅ Doit correspondre à id dans fichier_electoral
            $table->string('NumeroCarteElecteur')->nullable();
            $table->string('CIN')->nullable();
            $table->text('NatureProbleme'); // ✅ Contient la description de l’erreur
            $table->timestamps();

            $table->foreign('IDFichier')->references('id')->on('FichierElectoral')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ElecteursProblematiques');
    }
};