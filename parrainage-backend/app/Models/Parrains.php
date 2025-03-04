<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Parrains extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $table = 'parrains'; // Assurez-vous que ce nom est correct

    protected $fillable = [
        'NumeroCarteElecteur', 'CIN', 'Nom','Prenom','DateNaissance', 'BureauVote',
        'Email', 'Telephone', 'CodeAuth', 'CodeExpiration'
    ];
}
