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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.platform = this.telegramService.getPlatform();
    this.user = this.telegramService.getUserData();
    this.generateQRCode();
    this.inviteLink = this.telegramService.getInviteLink();
    this.referrerId = this.route.snapshot.queryParamMap.get('startapp');
    if (this.referrerId) {
      this.telegramService.sendReferrerIdToWebApp(this.referrerId);
    }
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

  register(): void {
    this.submitting = true;
    const referrerId = this.referrerId || 'null';
    this.dataService.saveUserData(this.email, this.user!, referrerId).subscribe(response => {
      this.submitting = false;
      this.successMessage = 'Success! Your data has been submitted.';
      setTimeout(() => {
        this.successMessage = '';
        this.router.navigate(['/']); // Navigate to the main page after registration
      }, 500);
    }, error => {
      this.submitting = false;
      this.errorMessage = 'Error! There was a problem submitting your data.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 500);
    });
  }
}
