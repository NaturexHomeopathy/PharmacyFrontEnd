import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OtpService } from '../../../Service/OtpService/otpservice';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  mobileNumber = '';
  address = '';
  otp = '';

  otpSent = false;
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private otpService: OtpService,
    private router: Router
  ) {}

  /* Numbers only */
  allowOnlyNumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  /* Validation */
  validateForm(): boolean {

    if (!this.firstName || !this.lastName || !this.email ||
        !this.password || !this.mobileNumber || !this.address) {

      this.errorMsg = "All fields required";
      return false;
    }

    if (this.mobileNumber.length !== 10) {
      this.errorMsg = "Mobile must be 10 digits";
      return false;
    }

    return true;
  }

  /* SEND OTP */
  sendOtp() {

    if (!this.validateForm()) return;

    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.otpService.sendOtp(this.email).subscribe({

      next: () => {
        this.otpSent = true;
        this.successMsg = "OTP Sent";
        this.isLoading = false;
      },

      error: err => {
        this.errorMsg = err.error || "Send OTP failed";
        this.isLoading = false;
      }

    });
  }

  /* VERIFY + REGISTER */
  verifyAndRegister() {

    if (!this.validateForm()) return;

    if (!this.otpSent) {
      this.errorMsg = "Send OTP first";
      return;
    }

    if (!this.otp || this.otp.length !== 6) {
      this.errorMsg = "Enter valid OTP";
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email.trim(),
      passwordHash: this.password,
      mobileNumber: this.mobileNumber,
      address: this.address
    };

    this.otpService.register(user, this.otp).subscribe({

      next: () => {
        this.successMsg = "Registered Successfully";
        this.isLoading = false;

        setTimeout(() => this.router.navigate(['/login']), 1500);
      },

      error: err => {
        this.errorMsg = err.error || "Registration failed";
        this.isLoading = false;
      }

    });
  }

  goToLogin() {
  this.router.navigate(['/login']);
}

}
