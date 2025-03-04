import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
      <!-- Hero Section -->
      <div class="container mx-auto px-4 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Système Electoral
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plateforme de gestion des élections, facilitant le processus démocratique de manière transparente et sécurisée.
          </p>
          <div class="space-x-4">
            <a routerLink="/voters" 
               class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Gestion des Électeurs
            </a>
            <a routerLink="/candidates" 
               class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Liste des Candidats
            </a>
             <a routerLink="/sponsorships" 
               class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Tableau de Bord Parrainages
            </a>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="container mx-auto px-4 py-16">
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <div class="text-blue-600 text-4xl mb-4">📋</div>
            <h3 class="text-xl font-semibold mb-2">Gestion des Électeurs</h3>
            <p class="text-gray-600">
              Import et validation des listes électorales avec vérification automatique des données.
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <div class="text-blue-600 text-4xl mb-4">👥</div>
            <h3 class="text-xl font-semibold mb-2">Gestion des Candidats</h3>
            <p class="text-gray-600">
              Enregistrement et suivi des candidatures avec validation des informations.
            </p>
          </div>
            <div class="bg-white p-6 rounded-xl shadow-lg">
            <div class="text-blue-600 text-4xl mb-4">📊</div>
            <h3 class="text-xl font-semibold mb-2">Suivi des Parrainages</h3>
            <p class="text-gray-600">
              Tableau de bord avec statistiques détaillées sur l'évolution des parrainages par candidat.
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg">
            <div class="text-blue-600 text-4xl mb-4">🗓️</div>
            <h3 class="text-xl font-semibold mb-2">Calendrier Electoral</h3>
            <p class="text-gray-600">
              Planification et suivi des périodes de parrainage et des échéances électorales.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}