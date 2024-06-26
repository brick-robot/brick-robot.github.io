import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'YOUR_GOOGLE_SHEETS_API_URL';

  constructor(private http: HttpClient) { }

  saveUserData(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post(this.apiUrl, data);
  }

  // Add more methods for other interactions with the backend
}
