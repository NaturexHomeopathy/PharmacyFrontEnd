import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../Environment/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private http: HttpClient) {}

  sendOtp(email: string) {
    return this.http.post(
      `${environment.apiBaseUrl}/api/otp/send-otp`,
      { email: email.trim() },
      { responseType: 'text' as 'json' }
    );
  }

  register(user: any, otp: string) {
  return this.http.post(
    `${environment.apiBaseUrl}/api/otp/verify-otp-register?otp=${otp.trim()}`,
    user,
    { responseType: 'text' }
  );
}

// ================= FORGOT PASSWORD =================

  sendOtpForgot(email: string) {
    return this.http.post(
      `${environment.apiBaseUrl}/api/otp/forgot-send-otp`,
      { email: email.trim() },
      { responseType: 'text' as 'json' }
    );
  }

  resetPassword(email: string, otp: string, newPassword: string) {
    return this.http.post(
      `${environment.apiBaseUrl}/api/otp/forgot-reset-password?email=${email.trim()}&otp=${otp.trim()}&newPassword=${newPassword}`,
      {},
      { responseType: 'text' as 'json' }
    );
  }

}
