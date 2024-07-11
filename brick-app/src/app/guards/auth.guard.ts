import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private dataService: DataService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const userEmail = localStorage.getItem('email');

    if (!userEmail) {
      this.router.navigate(['/register']);
      return false;
    }

    return this.checkEmail(userEmail).pipe(
      map(exists => {
        if (exists) {
          return true;
        } else {
          this.router.navigate(['/register']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Error checking email existence:', error);
        this.router.navigate(['/register']);
        return of(false);
      })
    );
  }

  checkEmail(email: string): Observable<boolean> {
    return this.dataService.checkEmailExists(email).pipe(
      map(response => response.exists),
      catchError(error => {
        console.error('Error:', error);
        return of(false);
      })
    );
  }
}
