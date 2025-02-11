<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Model
{

    use HasApiTokens, HasFactory;
    protected $fillable = ['nom_utilisateur', 'email', 'mot_de_passe', 'role'];

    protected $hidden = ['mot_de_passe'];
}