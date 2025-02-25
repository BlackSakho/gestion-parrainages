import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidate';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-candidate-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Enregistrement d'un Candidat</h2>

      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <!-- Étape 1: Vérification du numéro d'électeur -->
        <div class="mb-4" *ngIf="!candidateFound">
          <label class="block text-gray-700 text-sm font-bold mb-2">Numéro de Carte d'Électeur</label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" 
                 type="text" [(ngModel)]="searchElectorNumber" placeholder="Entrez le numéro">
          <button class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  (click)="verifyElector()">
            Vérifier
          </button>
          
          <p *ngIf="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
        </div>

        <!-- Étape 2: Informations sur le candidat -->
        <div *ngIf="candidateFound && !candidateExists">
          <p class="font-semibold">Nom: {{candidate.Nom}}</p>
          <p class="font-semibold">Prénom: {{candidate.Prenom}}</p>
          <p class="font-semibold">Date de naissance: {{candidate.DateNaissance}}</p>

          <label>Email</label>
          <input class="border rounded w-full py-2 px-3 mb-2" type="email" [(ngModel)]="candidate.Email">

          <label>Téléphone</label>
          <input class="border rounded w-full py-2 px-3 mb-2" type="tel" [(ngModel)]="candidate.Telephone">

          <label>Parti Politique</label>
          <input class="border rounded w-full py-2 px-3 mb-2" type="text" [(ngModel)]="candidate.PartiPolitique">

          <label>Slogan</label>
          <input class="border rounded w-full py-2 px-3 mb-2" type="text" [(ngModel)]="candidate.Slogan">

          <label>URL de la Photo</label>
          <input class="border rounded w-full py-2 px-3 mb-2" type="text" [(ngModel)]="candidate.Photo">

          <label>Couleurs du Parti (ex: #FF0000, #00FF00, #0000FF)</label>
          <input class="border rounded w-full py-2 px-3 mb-2" type="text" [(ngModel)]="candidate.Couleurs">

          <label>URL d'Informations</label>
          <input class="border rounded w-full py-2 px-3 mb-4" type="text" [(ngModel)]="candidate.URL">

          <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  (click)="registerCandidate()">
            Enregistrer le Candidat
          </button>
        </div>
      </div>
    </div>
  `
})
export class CandidateRegistrationComponent {
  searchElectorNumber: string = '';
  candidateFound: boolean = false;
  candidateExists: boolean = false;
  errorMessage: string = '';
  candidate: Candidate = new Candidate();

  constructor(private candidateService: CandidateService) {}

  verifyElector() {
    this.errorMessage = ''; // Réinitialiser les messages d'erreur
    this.candidateExists = false;

    this.candidateService.verifierElecteur(this.searchElectorNumber).subscribe({
      next: (data) => {
        if (data.candidat_existe) {
          this.candidateExists = true;
          this.errorMessage = "⚠️ Candidat déjà enregistré !";
        } else {
          this.candidate = {
            ...this.candidate,
            NumeroCarteElecteur: this.searchElectorNumber, 
            Nom: data.Nom,
            Prenom: data.Prenom,
            DateNaissance: data.DateNaissance
          };
          this.candidateFound = true;
        }
      },
      error: () => {
        this.errorMessage = "⚠️ Électeur introuvable !";
      }
    });
  }

  registerCandidate() {
    this.candidateService.enregistrerCandidat(this.candidate).subscribe({
      next: () => alert("✅ Candidat enregistré avec succès !"),
      error: () => alert("❌ Erreur d'enregistrement !")
    });
  }
}
