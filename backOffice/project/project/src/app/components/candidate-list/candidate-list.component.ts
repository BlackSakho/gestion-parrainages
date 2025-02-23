import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Candidate } from '../../models/candidate';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Liste des Candidats</h2>
        <a routerLink="/candidates/new" 
           class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Nouveau Candidat
        </a>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let candidate of candidates" 
             class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center space-x-4 mb-4">
            <div class="flex-shrink-0">
              <img [src]="candidate.Photo || 'assets/default-avatar.png'" 
                   alt="Photo du candidat"
                   class="w-16 h-16 rounded-full object-cover">
            </div>
            <div>
              <h3 class="text-lg font-semibold">{{candidate.Prenom}} {{candidate.Nom}}</h3>
              <p class="text-gray-600">{{candidate.PartiPolitique || 'Indépendant'}}</p>
            </div>
          </div>
          
          <div class="space-y-2">
            <p class="text-sm"><strong>Email:</strong> {{candidate.Email}}</p>
            <p class="text-sm"><strong>Téléphone:</strong> {{candidate.Telephone}}</p>
            <p *ngIf="candidate.Slogan" class="text-sm italic">"{{candidate.Slogan}}"</p>
          </div>

          <div class="mt-4 flex justify-end">
            <button 
              class="text-blue-600 hover:text-blue-800"
              (click)="regenerateSecurityCode(candidate.NumeroCarteElecteur)">
              Générer nouveau code
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="candidates.length === 0" 
           class="text-center py-8 text-gray-600">
        Aucun candidat enregistré pour le moment.
      </div>
    </div>
  `
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];

  constructor(private candidateService: CandidateService) {}

  ngOnInit() {
    this.loadCandidats();
  }

  loadCandidats() {
    this.candidateService.getCandidats().subscribe({
      next: (data) => this.candidates = data,
      error: (err) => console.error('Erreur lors de la récupération des candidats:', err)
    });
  }

  regenerateSecurityCode(electorNumber: string) {
    this.candidateService.regenererCodeSecurite(electorNumber).subscribe({
      next: () => alert('Un nouveau code a été envoyé au candidat ✅'),
      error: (err) => console.error('Erreur lors de la régénération du code:', err)
    });
  }
}
