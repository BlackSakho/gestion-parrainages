import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParrainageService {
  private apiUrl = 'http://127.0.0.1:8000/api/periode-parrainage'; // 🔗 URL de l'API Laravel

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // 📌 Récupérer le jeton stocké
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * 📌 1️⃣ Enregistrer une nouvelle période de parrainage
   * @param startDate Date de début
   * @param endDate Date de fin
   * @returns Observable avec la réponse de l'API
   */
  enregistrerPeriode(startDate: string, endDate: string): Observable<any> {
    return this.http.post(this.apiUrl, { DateDebut: startDate, DateFin: endDate }, { headers: this.getAuthHeaders() });
  }

  /**
   * 📌 2️⃣ Récupérer la période de parrainage actuelle
   * @returns Observable avec les détails de la période active
   */
  getPeriode(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  /**
   * 📌 3️⃣ Vérifier et activer/désactiver automatiquement la période
   * @returns Observable avec l'état de la période
   */
  verifierActivation(): Observable<any> {
    return this.http.get(`${this.apiUrl}/verifier`, { headers: this.getAuthHeaders() });
  }
}
