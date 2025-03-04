import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private tokenKey = 'authToken';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  register(user: { name: string, prenom: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/dge/register`, user).pipe(
      tap(response => console.log('Registration response:', response))
    );
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/dge/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem(this.tokenKey, response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/dge/logout`, {}, { headers: this.getAuthHeaders() }).subscribe(() => {
      localStorage.removeItem(this.tokenKey);
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private hasToken(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}