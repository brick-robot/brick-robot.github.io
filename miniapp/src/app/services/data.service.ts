import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://script.google.com/macros/s/AKfycbybErs1vho3O_wK_AQMc0wedbc6lJYLT0t9FF4V8KOVSXeECDccMtj53Ins1Q4dPQyf/exec';

  constructor(private http: HttpClient) { }

  saveUserData(email: string, user: Partial<User>, referrerId: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('id', user.id!.toString());
    formData.append('firstName', user.firstName || 'null');
    formData.append('lastName', user.lastName || 'null');
    formData.append('username', user.username || 'null');
    formData.append('referrerId', referrerId || 'null');

    return this.http.post(this.apiUrl, formData);
  }

  checkEmailExists(email: string): Observable<any> {
    const params = new HttpParams().set('action', 'checkEmailExists').set('email', email);
    return this.http.get(this.apiUrl, { params });
  }

  checkEmailAndIdExists(email: string, id: string): Observable<any> {
    const params = new HttpParams().set('action', 'checkEmailAndIdExists').set('email', email).set('id', id);
    return this.http.get(this.apiUrl, { params });
  }

  getUsersByReferrerId(referrerId: string): Observable<any> {
    const params = new HttpParams().set('action', 'getUsersByReferrerId').set('referrerId', referrerId);
    return this.http.get(this.apiUrl, { params });
  }
}
