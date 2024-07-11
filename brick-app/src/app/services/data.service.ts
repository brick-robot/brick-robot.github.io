import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://script.google.com/macros/s/AKfycbztaPnbTaBPQ7VpPzKyqkUXCDhEmoBDmsOQ-vHpqteIVXReAfLBqd0a_V9j9w2SeI3K/exec';

  constructor(private http: HttpClient) { }

  saveUserData(email: string, user: Partial<User> ,referrerId:string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('id', user.id!.toString());
    formData.append('firstName', user.firstName || 'null');
    formData.append('lastName', user.lastName || 'null');
    formData.append('username', user.username || 'null');
    formData.append('referrerId',  referrerId || 'null');

    return this.http.post(this.apiUrl, formData);
  }
}


