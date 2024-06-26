import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TelegramService } from '../services/telegram.service';
import { DataService } from '../services/data.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  platform: string | undefined;
  email: string = '';
  password: string = '';
  user: any;
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
    const qrData = 'https://t.me/brick_robot'; // داده‌ای که می‌خواهید در QR کد نمایش داده شود
    QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Error generating QR code', err);
        return;
      }
      this.qrCodeDataUrl = url;
    });
  }

  register(): void {
    this.dataService.saveUserData(this.email, this.password).subscribe(response => {
      console.log('User registered:', response);
      this.telegramService.setUserEmail(this.email);
      this.router.navigate(['/']); 
    }, error => {
      console.error('Error registering user:', error);
    });
  }
}
