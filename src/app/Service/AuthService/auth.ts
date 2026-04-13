import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../Environment/environment/environment';
import { LoginRequest } from '../../Model/login-request';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = `${environment.apiBaseUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  // ===== LOGIN =====
  login(data: LoginRequest) {
    return this.http.post<{
      token: string;
      refreshToken: string;
    }>(`${this.baseUrl}/login`, data);
  }

  // ===== SAVE TOKENS =====
  saveSession(token: string, refreshToken: string) {

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    const payload = JSON.parse(atob(token.split('.')[1]));

    const role =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      || payload['role'];

    if (role) {
      localStorage.setItem('role', role.toUpperCase());
    }
  }

  // ===== GETTERS =====
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ===== LOGOUT =====
  logout() {
    localStorage.clear();
  }
}