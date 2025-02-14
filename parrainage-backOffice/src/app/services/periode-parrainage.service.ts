import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodeParrainageService {
  private apiUrl = 'http://127.0.0.1:8000/api/periode-parrainage';

  constructor(private http: HttpClient) {}

  // Récupérer l’état actuel de la période
  getPeriodeStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/status`);
  }

  // Ouvrir la période de parrainage
  ouvrirPeriode(): Observable<any> {
    return this.http.post(`${this.apiUrl}/ouvrir`, {});
  }

  // Fermer la période de parrainage
  fermerPeriode(): Observable<any> {
    return this.http.post(`${this.apiUrl}/fermer`, {});
  }
}
