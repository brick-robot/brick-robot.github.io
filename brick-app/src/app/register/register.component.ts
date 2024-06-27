import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelegramService } from '../services/telegram.service';
import { DataService } from '../services/data.service';
import { User } from '../interfaces/user.interface';
import * as QRCode from 'qrcode';
import { Telegram } from "@twa-dev/types"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  platform: string | undefined;
  email: string = '';
  user: Partial<User> | null = null;
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
    private router: Router  ) { }

  ngOnInit(): void {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.MainButton.text = "Close App";
    tg.MainButton.show();
    tg.MainButton.onClick(() => tg.close());

    this.platform = this.telegramService.getPlatform();
    this.user = this.telegramService.getUserData();
    this.generateQRCode();
    this.inviteLink = this.telegramService.getInviteLink();
    this.referrerId = this.user?.referrerId? this.user?.referrerId : null;
    if (this.referrerId) {
      this.telegramService.sendReferrerIdToWebApp(this.referrerId);
    }

    tg.ready();
    this.updateTheme();
  }

  generateQRCode(): void {
    const qrData = 'https://t.me/brick_robot';
    QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Error generating QR code', err);
        return;
      }
      this.qrCodeDataUrl = url;
    });
  }

  updateTheme(): void {
    const tg = window.Telegram.WebApp;
    document.body.style.backgroundColor = tg.themeParams.bg_color;
    document.body.style.color = tg.themeParams.text_color;

    const container = document.querySelector('.container') as HTMLElement;
    if (container) {
      container.style.backgroundColor = tg.themeParams.secondary_bg_color;
    }
  }

  register(): void {
    if (!this.user) {
      this.errorMessage = 'User data is not available.';
      return;
    }

    this.submitting = true;

    // Ensure user.id is set before proceeding
    const userId = this.user.id;
    const userFirstName = this.user.firstName || 'null';
    const userLastName = this.user.lastName || 'null';
    const userUsername = this.user.username || 'null';
    const referrerId = this.referrerId || 'null';

    this.dataService.saveUserData(this.email, { id: userId, firstName: userFirstName, lastName: userLastName, username: userUsername }, referrerId).subscribe(
      response => {
        this.submitting = false;
        this.successMessage = 'Success! Your data has been submitted.';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/']); // Navigate to the main page after registration
        }, 500);
      },
      error => {
        this.submitting = false;
        this.errorMessage = 'Error! There was a problem submitting your data.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 500);
      }
    );
  }
}
