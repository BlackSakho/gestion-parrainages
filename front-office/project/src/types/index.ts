export interface Parrains {
  NumeroCarteElecteur: string;
  CIN: string;
  Nom: string;
  BureauVote: string;
  Telephone: string;
  Email: string;
  CodeAuth: string;
  
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