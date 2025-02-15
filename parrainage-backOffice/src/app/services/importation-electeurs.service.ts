import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportationElecteursService {
  private apiUrl = 'http://127.0.0.1:8000/api/electeurs/upload';

  constructor(private http: HttpClient) {}

  uploadFichier(file: File, checksum: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('checksum', checksum);

    console.log('Envoi du fichier avec checksum:', checksum);
    return this.http.post(this.apiUrl, formData);
  }
}
