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
    private router: Router) { }

  ngOnInit(): void {
    this.telegramService.ready();
    this.platform = this.telegramService.getPlatform();
    this.user = this.telegramService.getUserData();
    this.generateQRCode();
    this.inviteLink = this.telegramService.getInviteLink();
    this.referrerId = this.user?.referrerId ? this.user?.referrerId : null;

    this.initializeMainButton();
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


  register(): void {
    if (!this.user) {
      this.errorMessage = 'User data is not available.';
      return;
    }

    this.submitting = true;

    const userId = this.user.id;
    const userFirstName = this.user.firstName || 'null';
    const userLastName = this.user.lastName || 'null';
    const userUsername = this.user.username || 'null';
    const referrerId = this.referrerId || 'null';

    this.dataService.saveUserData(this.email, { id: userId, firstName: userFirstName, lastName: userLastName, username: userUsername }, referrerId).subscribe(
      response => {
        this.submitting = false;
        this.successMessage = 'Success! Your data has been submitted.';
        this.telegramService.showNotification('success');
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/']); // Navigate to the main page after registration
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

  private initializeMainButton(): void {
    this.telegramService.setMainButton("Close App", () => this.telegramService.close());
  }
}
