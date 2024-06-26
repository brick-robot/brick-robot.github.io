import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://script.google.com/macros/s/AKfycbxEevK6Hf1VLIYid2lS9OewUxiNaBusWv9iNHLiDmLXaPYyjhwKKjFXaVJkrQuu0j7D/exec';

  constructor(private http: HttpClient) { }

  saveUserData(email: string, user: User): Observable<any> {
    const data = { email, ...user };
    return this.http.post(this.apiUrl, data);
  }
}
