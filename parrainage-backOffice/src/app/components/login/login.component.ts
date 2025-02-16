import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] // ✅ Ajout de FormsModule pour ngModel
})
export class LoginComponent {
  user = { email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log('Logging in with user:', this.user);
    this.authService.login(this.user).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/accueil']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Email ou mot de passe incorrect ❌';
      }
    });
  }
}
