export interface Electeur {
  id: number;
  NumeroCarteElecteur: string;
  CIN: string;
  Nom: string;
  Prenom: string;
  DateNaissance: string;
  Commune: string;
  BureauVote: string;
  Email: string;
  Telephone: string;
  LieuDeNaissance: string;
  Sexe: string;
}

export interface ElecteursTemp {
  id: number;
  NumeroCarteElecteur: string;
  CIN: string;
  Nom: string;
  Prenom: string;
  DateNaissance: string;
  Commune: string;
  BureauVote: string;
  Email: string;
  Telephone: string;
  LieuDeNaissance: string;
  Sexe: string;
}



export interface HistoriqueUpload {
  UtilisateurID: number;
  AdresseIP: string;
  DateUpload: string;
  ClefUtilisee: string;
}

export interface electeursProblematiques {
  IDFichier: number;
  CIN: string;
  NumeroCarteElecteur: string;
  NatureProbleme: string;
}