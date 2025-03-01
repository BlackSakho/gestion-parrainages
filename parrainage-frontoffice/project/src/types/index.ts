export interface Parrains {
  NumeroCarteElecteur: string;
  CIN: string;
  Nom: string;
  BureauVote: string;
  Telephone: string;
  Email: string;
  CodeAuth: string;
  
}
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

export interface Candidats {
  id: number;
  NumeroCarteElecteur: string;
  nom: string;
  prenom: string;
  DateNaissance: string;
  Email: string;
  Telephone: string;
  PartiPolique: string;
  slogan: string;
  photo: string;
  couleurs: string;
  URL: string;
  CodeSecurite: string;

}

export interface Parrainages {
  ElecteurID: string;
  CandidatID: string;
  codeValidation: string;
}