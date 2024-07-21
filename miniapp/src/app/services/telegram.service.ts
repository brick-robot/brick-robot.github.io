import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { WebAppInitData, ThemeParams, PopupParams, ScanQrPopupParams, EventParams, EventNames, Platforms } from '@twa-dev/types';
import WebApp from '@twa-dev/sdk';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private webApp: typeof WebApp;
  private initData!: WebAppInitData;

  constructor() {
    this.webApp = WebApp;

    if (this.webApp.initDataUnsafe) {
      this.initData = this.webApp.initDataUnsafe;

      this.webApp.ready();
      console.log('Telegram WebApp initialized');
      this.storeUserData();

      this.webApp.expand();
      // this.webApp.MainButton.setText("Close App");
      // this.webApp.MainButton.show();
      this.webApp.MainButton.onClick(() => this.webApp.close());
    } else {
      console.error('Telegram WebApp is not available');
    }
  }

  private storeUserData(): void {
    if (this.initData.user) {
      localStorage.setItem('userId', this.initData.user.id.toString());
      localStorage.setItem('userFirstName', this.initData.user.first_name || '');
      localStorage.setItem('userLastName', this.initData.user.last_name || '');
      localStorage.setItem('userUsername', this.initData.user.username || '');
      localStorage.setItem('referrerId', this.initData.start_param || '');
    } else {
      // Test data
      localStorage.setItem('userId', '123456789');
      localStorage.setItem('userFirstName', 'TestFirstName');
      localStorage.setItem('userLastName', 'TestLastName');
      localStorage.setItem('userUsername', 'TestUsername');
      localStorage.setItem('referrerId', '123456780');
    }
  }

  getPlatform(): Platforms {
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
    const userId = this.webApp.initDataUnsafe.user?.id;
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

  // QR Code and Clipboard Management
  showScanQrPopup(params: ScanQrPopupParams, callback?: (text: string) => void | true): void {
    this.webApp.showScanQrPopup(params, callback);
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

  // Event Handling
  onEvent<T extends EventNames>(eventName: T, callback: (params: EventParams[T]) => unknown): void {
    this.webApp.onEvent(eventName, callback);
  }

  offEvent<T extends EventNames>(eventName: T, callback: (params: EventParams[T]) => unknown): void {
    this.webApp.offEvent(eventName, callback);
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
    this.webApp.ready();
  }

  close(): void {
    this.webApp.close();
  }

  expand(): void {
    this.webApp.expand();
  }
}
