import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelegramService } from '../services/telegram.service';
import { DataService } from '../services/data.service';
import { User } from '../interfaces/user.interface';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  platform: string | undefined;
  email: string = '';
  user: any;
  submitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  qrCodeDataUrl: string = '';
  inviteLink: string = '';
  referrerId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private telegramService: TelegramService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeTelegramWebApp();
    this.loadUserData();
    this.generateQRCode();
    this.updateTheme();
  }

  private initializeTelegramWebApp(): void {
     this.platform = this.telegramService.getPlatform();
    this.user = this.telegramService.getUserData();
    this.referrerId = this.route.snapshot.queryParamMap.get('startapp') || null;
    if (!this.user) {
      window.location.href = `https://t.me/brick_robot?start=miniapp`;
    }
  }

  private loadUserData(): void {
    this.inviteLink = this.telegramService.getInviteLink();
    if (this.referrerId) {
      this.telegramService.sendReferrerIdToWebApp(this.referrerId);
    }
  }

  generateQRCode(): void {
    const qrData = this.referrerId ? `https://t.me/brick_robot?startapp=${this.referrerId}` : 'https://t.me/brick_robot';
    QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Error generating QR code', err);
        return;
      }
      this.qrCodeDataUrl = url;
    });
  }



  private updateTheme(): void {
    const themeParams = this.telegramService.getThemeParams();
    document.body.style.backgroundColor = themeParams.bg_color;
    document.body.style.color = themeParams.text_color;

    const container = document.querySelector('.container');
    if (container instanceof HTMLElement) {
      container.style.backgroundColor = themeParams.secondary_bg_color;
    }
  }

  register(): void {
    if (!this.user) {
      this.errorMessage = 'User data is not available.';
      return;
    }

    this.submitting = true;
    const userData: Partial<User> = {
      id: this.user.id!,
      firstName: this.user.firstName || 'null',
      lastName: this.user.lastName || 'null',
      username: this.user.username || 'null',
      referrerId: this.referrerId || 'null'
    };

    this.dataService.saveUserData(this.email, userData).subscribe(
      response => {
        this.submitting = false;
        this.successMessage = 'Success! Your data has been submitted.';
        this.telegramService.showNotification('success');
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/']);
        }, 500);
      },
      error => {
        this.submitting = false;
        this.errorMessage = 'Error! There was a problem submitting your data.';
        this.telegramService.showNotification('error');
        setTimeout(() => {
          this.errorMessage = '';
        }, 500);
      }
    );
  }
}
