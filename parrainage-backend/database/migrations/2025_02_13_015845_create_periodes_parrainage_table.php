<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('periodes_parrainage', function (Blueprint $table) {
            $table->id();
            $table->enum('etat', ['Ouvert', 'Fermé'])->default('Fermé');

            $table->timestamps();
        });

        // Insérer une période initiale
        DB::table('periodes_parrainage')->insert([
            'etat' => 'Fermé',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('periodes_parrainage');
    }
};
