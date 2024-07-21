import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, finalize } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private dataService: DataService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    const userEmail = localStorage.getItem('email');

    if (!userEmail) {
      this.router.navigate(['/register']);
      return false;
    }

    this.loadingService.show();

    return this.checkEmail(userEmail).pipe(
      map(exists => {
        if (exists) {
          this.authService.setAuthenticated(true);
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
      }),
      finalize(() => {
        this.loadingService.hide();
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
