import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ElecteursService {
  private apiUrl = 'http://127.0.0.1:8000/api/electeurs';

  constructor(private http: HttpClient) { }

  // Récupérer les électeurs en attente de validation
  getElecteursTemp(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/temp`);
  }

  // Valider un électeur
  validerElecteur(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/valider/${id}`, {});
  }

  // Rejeter un électeur
  rejeterElecteur(id: number, raison: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/rejeter/${id}`, { raison });
  }
}
