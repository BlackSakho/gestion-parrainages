export class Candidate {
  NumeroCarteElecteur!: string;  // Numéro de carte d'électeur (obligatoire)
  Nom!: string;                  // Nom du candidat
  Prenom!: string;                // Prénom du candidat
  DateNaissance!: string;         // Date de naissance (format YYYY-MM-DD)
  Email!: string;                 // Adresse e-mail
  Telephone!: string;             // Numéro de téléphone
  PartiPolitique?: string;        // Parti politique (optionnel)
  Slogan?: string;                // Slogan (optionnel)
  Photo?: string;                 // URL de la photo (optionnel)
  Couleurs?: string;              // Couleurs du parti (optionnel)
  URL?: string;                   // Lien vers une page d'informations (optionnel)
  CodeSecurite?: string;          // Code de sécurité envoyé au candidat
}