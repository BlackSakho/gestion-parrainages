import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionCandidatsService {
  private apiUrl = 'http://127.0.0.1:8000/api/candidats';

  constructor(private http: HttpClient) {}

  getCandidats(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  ajouterCandidat(candidat: any): Observable<any> {
    return this.http.post(this.apiUrl, candidat);
  }

  supprimerCandidat(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
