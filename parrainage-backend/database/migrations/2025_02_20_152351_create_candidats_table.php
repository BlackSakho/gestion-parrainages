<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('Candidats', function (Blueprint $table) {
            $table->id();
            $table->string('NumeroCarteElecteur', 20)->unique(); // 🔑 Clé unique
            $table->string('Nom');
            $table->string('Prenom');
            $table->date('DateNaissance');
            $table->string('Email')->unique();
            $table->string('Telephone')->unique();
            $table->string('PartiPolitique')->nullable();
            $table->string('Slogan')->nullable();
            $table->string('Photo')->nullable();
            $table->string('Couleurs')->nullable();
            $table->string('URL')->nullable();
            $table->string('CodeSecurite'); // 🔐 Code envoyé au candidat
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('Candidats');
    }
};