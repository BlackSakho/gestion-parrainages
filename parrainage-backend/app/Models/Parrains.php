<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Parrains extends Authenticatable

{
    use HasFactory, HasApiTokens;
    protected $table = 'Parrains';

    protected $fillable = [
        'NumeroCarteElecteur',
        'CIN',
        'Nom',
        'BureauVote',
        'Email',
        'Telephone',
        'CodeAuth',
        'CodeExpiration'
    ];




public function setCodeAuthentificationAttribute($value)
{
    $this->attributes['codeAuth'] = bcrypt($value);
}
}