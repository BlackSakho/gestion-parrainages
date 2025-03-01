<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parrains extends Model
{
    use HasFactory;
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
