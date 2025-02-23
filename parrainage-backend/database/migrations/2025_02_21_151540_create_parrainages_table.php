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
        Schema::create('Parrainages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ElecteurID')->constrained('Parrains')->onDelete('cascade');
            $table->foreignId('CandidatID')->constrained('Candidats')->onDelete('cascade');
            $table->string('CodeValidation');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('Parrainages');
    }
};