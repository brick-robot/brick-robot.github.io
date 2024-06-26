import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TelegramService } from '../services/telegram.service';
import { DataService } from '../services/data.service';
import * as QRCode from 'qrcode';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  platform: string | undefined;
  email: string = '';
  user: Partial<User> | null = null;
  qrCodeDataUrl: string = '';

  constructor(
    private telegramService: TelegramService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.platform = this.telegramService.getPlatform();
    this.user = this.telegramService.getUserData();
    this.generateQRCode();
  }

  generateQRCode(): void {
    const qrData = 'https://t.me/brick_robot'; // Data to be encoded in the QR code
    QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Error generating QR code', err);
        return;
      }
      this.qrCodeDataUrl = url;
    });
  }

  register(): void {
    if (this.user) {
      const userData: User = {
        id: this.user.id!,
        firstName: this.user.firstName || null,
        lastName: this.user.lastName || null,
        username: this.user.username || null,
        photoUrl: this.user.photoUrl || null
      };
      this.dataService.saveUserData(this.email, userData)
        .subscribe(response => {
          console.log('User registered:', response);
          this.telegramService.setUserEmail(this.email);
          this.router.navigate(['/']); // Navigate to the main page after registration
        }, error => {
          console.error('Error registering user:', error);
        });
    } else {
      console.error('User data not available');
    }
  }
}
