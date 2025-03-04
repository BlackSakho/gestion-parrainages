<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() {
        Schema::create('Parrains', function (Blueprint $table) {
            $table->id();
            $table->string('NumeroCarteElecteur')->unique();
            $table->string('CIN')->unique();
            $table->string('Nom');
            $table->string('Prenom');
            $table->date('DateNaissance');
            $table->string('BureauVote');
            $table->string('Email')->unique();
            $table->string('Telephone')->unique();
            $table->string('CodeAuth')->nullable();
            $table->timestamp('CodeExpiration')->nullable();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('Parrains');
    }
};