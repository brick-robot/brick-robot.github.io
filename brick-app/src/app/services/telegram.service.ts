import { Injectable } from '@angular/core';
import { WebAppInitData } from '../interfaces/web-app-init-data.interface';
import WebApp from '@twa-dev/sdk';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private webApp: typeof WebApp;
  private initData: WebAppInitData;

  constructor() {
    this.webApp = WebApp;
    this.webApp.ready();
    this.initData = this.webApp.initDataUnsafe;

    console.log('Telegram WebApp initialized');
    this.storeUserData();
  }

  private storeUserData(): void {
    if (this.initData.user) {
      localStorage.setItem('userId', this.initData.user.id.toString());
      localStorage.setItem('userFirstName', this.initData.user.first_name || '');
      localStorage.setItem('userLastName', this.initData.user.last_name || '');
      localStorage.setItem('userUsername', this.initData.user.username || '');
      localStorage.setItem('userPhotoUrl', this.initData.user.photo_url || '');
    } else {
      // Test data
      localStorage.setItem('userId', '123456789');
      localStorage.setItem('userFirstName', 'TestFirstName');
      localStorage.setItem('userLastName', 'TestLastName');
      localStorage.setItem('userUsername', 'TestUsername');
      localStorage.setItem('userPhotoUrl', 'https://example.com/photo.jpg');
    }
  }

  getPlatform(): string {
    return this.webApp.platform;
  }

  getThemeParams(): any {
    return this.webApp.themeParams;
  }

  showAlert(message: string): void {
    this.webApp.showAlert(message);
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  setUserEmail(email: string): void {
    localStorage.setItem('userEmail', email);
  }

  clearUserEmail(): void {
    localStorage.removeItem('userEmail');
  }

  getUserData(): Partial<User> | null {
    const id = localStorage.getItem('userId');
    const firstName = localStorage.getItem('userFirstName');
    const lastName = localStorage.getItem('userLastName');
    const username = localStorage.getItem('userUsername');
    const photoUrl = localStorage.getItem('userPhotoUrl');

    if (id) {
      return {
        id: parseInt(id, 10),
        firstName: firstName || null,
        lastName: lastName || null,
        username: username || null,
        photoUrl: photoUrl || null
      };
    }

    return null;
  }
}
