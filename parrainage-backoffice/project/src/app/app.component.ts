import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-lg">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <a routerLink="/" class="text-xl font-semibold text-gray-800">
                Système Electoral
              </a>
              <div class="hidden md:flex items-center space-x-8 ml-10" *ngIf="authService.isAuthenticated()">
                <a routerLink="/voters" class="text-gray-600 hover:text-blue-600 transition-colors">Électeurs</a>
                <a routerLink="/candidates" class="text-gray-600 hover:text-blue-600 transition-colors">Candidats</a>
                <a routerLink="/schedule" class="text-gray-600 hover:text-blue-600 transition-colors">Calendrier</a>
                <a routerLink="/sponsorships" class="text-gray-600 hover:text-blue-600 transition-colors">Tableau de Bord</a>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ng-container *ngIf="authService.isAuthenticated(); else loginButton">
                <button 
                  (click)="logout()"
                  class="text-gray-600 hover:text-blue-600 transition-colors">
                  Déconnexion
                </button>
              </ng-container>
              <ng-template #loginButton>
                <a 
                  routerLink="/login"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Connexion
                </a>
              </ng-template>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}