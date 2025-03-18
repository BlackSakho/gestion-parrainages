export interface Parrains {
  id: number;
  NumeroCarteElecteur: string;
  CIN: string;
  Nom: string;
  Prenom: string;
  DateNaissance: string;
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
  Nom: string;
  Prenom: string;
  DateNaissance: string;
  Email: string;
  Telephone: string;
  PartiPolique: string;
  Slogan: string;
  Photo: string;
  Couleurs: string;
  URL: string;
  CodeSecurite: string;

}

export interface Parrainages {
  ElecteurID: string;
  CandidatID: string;
  CodeValidation: string;
}

export interface LoginData {
  NumeroCarteElecteur: string;
  CIN: string;
  CodeAuth: string;
}

export interface CandidatLoginData {
  Email: string;
  CodeSecurite: string;
}

export interface ParrainageStats {
  total: number;
  today: number;
  yesterday: number;
  lastWeek: number;
  byRegion: {
    region: string;
    count: number;
  }[];
  byDay: {
    date: string;
    count: number;
  }[];
}