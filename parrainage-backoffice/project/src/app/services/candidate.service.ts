import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../models/candidate';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'https://parrainage.beinnetcorporate.com/api/candidats';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Vérifier si l’électeur est éligible pour devenir candidat
  verifierElecteur(electorNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verifier`, { NumeroCarteElecteur: electorNumber }, { headers: this.getAuthHeaders() });
  }

  // Enregistrer un candidat
  enregistrerCandidat(candidat: Candidate): Observable<any> {
    return this.http.post(this.apiUrl, candidat, { headers: this.getAuthHeaders() });
  }

  //  Récupérer la liste des candidats
  getCandidats(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  //  Générer un nouveau code de sécurité
  regenererCodeSecurite(electorNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/regenerer-code`, { NumeroCarteElecteur: electorNumber }, { headers: this.getAuthHeaders() });
  }
}
