import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-voter-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Gestion des Électeurs</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Upload Card -->
          <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
            <div class="mb-4">
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Importer des Électeurs</h3>
              <p class="text-gray-600 mt-2">Chargez un nouveau fichier CSV d'électeurs avec vérification CHECKSUM.</p>
            </div>
            <a routerLink="/voters/upload" 
               class="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Charger un fichier
            </a>
          </div>

          <!-- Validation Card -->
          <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
            <div class="mb-4">
              <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Valider les Électeurs</h3>
              <p class="text-gray-600 mt-2">Vérifiez et validez les données des électeurs importés.</p>
            </div>
            <a routerLink="/voters/validate" 
               class="inline-block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Valider les électeurs
            </a>
          </div>

          <!-- Problematic Voters Card -->
          <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
            <div class="mb-4">
              <div class="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Électeurs Problématiques</h3>
              <p class="text-gray-600 mt-2">Consultez et gérez les électeurs ayant des données invalides.</p>
            </div>
            <a routerLink="/voters/problems" 
               class="inline-block w-full text-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Voir les problèmes
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VoterManagementComponent {}