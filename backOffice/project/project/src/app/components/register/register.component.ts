import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet, RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center px-4">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inscription
          </h2>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                [(ngModel)]="name"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nom"
              >
            </div>
            <div>
              <label for="prenom" class="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                [(ngModel)]="prenom"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Prénom"
              >
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                [(ngModel)]="email"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email"
              >
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                [(ngModel)]="password"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Mot de passe"
              >
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              S'inscrire
            </button>
          </div>

          <div *ngIf="error" class="text-red-600 text-center text-sm">
            {{ error }}
          </div>
        </form>
        <div class="text-center text-sm">
          <a routerLink="/login" routerLinkActive="active" ariaCurrentWhenActive="page" class="text-blue-600 hover:text-blue-800">
            Déjà un compte ? Connectez-vous
          </a>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.register({ name: this.name, prenom: this.prenom, email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = 'Erreur lors de l\'inscription';
          console.error('Registration error:', err);
        }
      });
  }
}