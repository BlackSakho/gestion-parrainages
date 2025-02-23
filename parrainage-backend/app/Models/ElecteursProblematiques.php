<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElecteursProblematiques extends Model
{
    use HasFactory;
    protected $table = 'ElecteursProblematiques';

    protected $fillable = [
        'IDFichier','NumeroCarteElecteur', 'CIN', 'NatureProbleme'
    ];
}