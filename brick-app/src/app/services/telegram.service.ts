import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Platform, PopupParams, ThemeParams, retrieveLaunchParams ,initMiniApp, postEvent  } from '@tma.js/sdk';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private webApp: any;
  private  miniApp: any;
  constructor() {

    // Retrieve launch parameters
     this.webApp = retrieveLaunchParams();

     this.miniApp = initMiniApp();
    // Store user data on initialization
    this.storeUserData();
  }

  private storeUserData(): void {
    if (this.webApp.initData.user) {
      localStorage.setItem('userId', this.webApp.initData.user.id.toString());
      localStorage.setItem('userFirstName', this.webApp.initData.user.first_name || '');
      localStorage.setItem('userLastName', this.webApp.initData.user.last_name || '');
      localStorage.setItem('userUsername', this.webApp.initData.user.username || '');
      localStorage.setItem('referrerId', this.webApp.initData.start_param || '');
    } else {
      // Test data
      localStorage.setItem('userId', '123456789');
      localStorage.setItem('userFirstName', 'TestFirstName');
      localStorage.setItem('userLastName', 'TestLastName');
      localStorage.setItem('userUsername', 'TestUsername');
      localStorage.setItem('referrerId', '123456780');
    }
  }

  getPlatform(): Platform {
    return this.webApp.platform;
  }

  getThemeParams(): ThemeParams {
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
    const referrerId = localStorage.getItem('referrerId');

    if (id) {
      return {
        id: parseInt(id, 10),
        firstName: firstName || null,
        lastName: lastName || null,
        username: username || null,
        referrerId: referrerId || null
      };
    }

    return null;
  }

  getInviteLink(): string {
    const userId = this.webApp.initData.user?.id;
    return `https://t.me/brick_robot?startapp=${userId}`;
  }

  sendReferrerIdToWebApp(referrerId: string): void {
    this.webApp.sendData(JSON.stringify({ referrerId }));
  }

  // Haptic Feedback Methods
  showNotification(type: 'success' | 'error' | 'warning'): void {
    this.webApp.HapticFeedback.notificationOccurred(type);
  }

  // Main Button Methods
  setMainButton(text: string, onClickCallback: VoidFunction): void {
    this.webApp.MainButton.setText(text);
    this.webApp.MainButton.show();
    this.webApp.MainButton.onClick(onClickCallback);
  }

  setMainButtonText(text: string): void {
    this.webApp.MainButton.setText(text);
  }

  showMainButton(): void {
    this.webApp.MainButton.show();
  }

  hideMainButton(): void {
    this.webApp.MainButton.hide();
  }

  enableMainButton(): void {
    this.webApp.MainButton.enable();
  }

  disableMainButton(): void {
    this.webApp.MainButton.disable();
  }

  showMainButtonProgress(leaveActive?: boolean): void {
    this.webApp.MainButton.showProgress(leaveActive);
  }

  hideMainButtonProgress(): void {
    this.webApp.MainButton.hideProgress();
  }

  // Back Button Methods
  setBackButton(onClickCallback: VoidFunction): void {
    this.webApp.BackButton.show();
    this.webApp.BackButton.onClick(onClickCallback);
  }

  hideBackButton(): void {
    this.webApp.BackButton.hide();
  }

  // Settings Button Methods
  setSettingsButton(onClickCallback: VoidFunction): void {
    this.webApp.SettingsButton.show();
    this.webApp.SettingsButton.onClick(onClickCallback);
  }

  hideSettingsButton(): void {
    this.webApp.SettingsButton.hide();
  }

  // Link Management
  openLink(url: string): void {
    this.webApp.openLink(url);
  }

  openTelegramLink(url: string): void {
    this.webApp.openTelegramLink(url);
  }

  // Closing Confirmation and Popups
  enableClosingConfirmation(): void {
    this.webApp.enableClosingConfirmation();
  }

  disableClosingConfirmation(): void {
    this.webApp.disableClosingConfirmation();
  }

  showConfirm(message: string, callback?: (confirmed: boolean) => void): void {
    this.webApp.showConfirm(message, callback);
  }

  showPopup(params: PopupParams, callback?: (id?: string) => unknown): void {
    this.webApp.showPopup(params, callback);
  }



  closeScanQrPopup(): void {
    this.webApp.closeScanQrPopup();
  }

  readTextFromClipboard(callback?: (text: string) => unknown): void {
    this.webApp.readTextFromClipboard(callback);
  }

  // Inline Query and Access Requests
  switchInlineQuery(query: string, chooseChatTypes?: Array<'users' | 'bots' | 'groups' | 'channels'>): void {
    this.webApp.switchInlineQuery(query, chooseChatTypes);
  }

  requestWriteAccess(callback?: (access: boolean) => unknown): void {
    this.webApp.requestWriteAccess(callback);
  }

  requestContact(callback?: (access: boolean) => unknown): void {
    this.webApp.requestContact(callback);
  }

  // Utility Methods
  setHeaderColor(color: 'bg_color' | 'secondary_bg_color' | `#${string}`): void {
    this.webApp.setHeaderColor(color);
  }

  setBackgroundColor(color: 'bg_color' | 'secondary_bg_color' | `#${string}`): void {
    this.webApp.setBackgroundColor(color);
  }

  isVersionAtLeast(version: string): boolean {
    return this.webApp.isVersionAtLeast(version);
  }

  ready(): void {
    this.miniApp.ready();
  }

  close(): void {
    this.miniApp.close();
  }

  expand(): void {
    postEvent('web_app_expand');
  }
}
