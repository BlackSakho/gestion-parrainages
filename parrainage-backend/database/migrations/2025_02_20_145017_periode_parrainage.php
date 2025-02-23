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
        Schema::create('PeriodeParrainage', function (Blueprint $table) {
            $table->id();
            $table->date('DateDebut')->unique();
            $table->date('DateFin')->unique();
            $table->boolean('Active')->default(false); // ✅ Indique si la période est active
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('PeriodeParrainage');
    }
};