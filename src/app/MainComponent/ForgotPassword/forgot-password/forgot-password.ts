import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OtpService } from '../../../Service/OtpService/otpservice';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPassword {

  email = '';
  otp = '';
  newPassword = '';

  otpSent = false;
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private otpService: OtpService,
    private router: Router
  ) {}

  // ================= SEND OTP =================
  sendOtp() {

    if (!this.email) {
      this.errorMsg = 'Enter email';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.otpService.sendOtpForgot(this.email).subscribe({

      next: () => {
        this.otpSent = true;
        this.successMsg = 'OTP sent to your email';
        this.isLoading = false;
      },

      error: (err) => {
        this.errorMsg = err.error || 'Failed to send OTP';
        this.isLoading = false;
      }

    });
  }

  // ================= RESET PASSWORD =================
  resetPassword() {

    if (!this.otp || !this.newPassword) {
      this.errorMsg = 'Enter OTP and new password';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.otpService.resetPassword(
      this.email,
      this.otp,
      this.newPassword
    ).subscribe({

      next: () => {

        this.successMsg = 'Password changed successfully';

        // Redirect to login after short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);

      },

      error: (err) => {
        this.errorMsg = err.error || 'Reset failed';
        this.isLoading = false;
      }

    });
  }

}