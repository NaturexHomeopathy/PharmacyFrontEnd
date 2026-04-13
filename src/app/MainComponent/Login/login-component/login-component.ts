import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Service/AuthService/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  rememberMe = false;

  errorMsg = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // RESTORE remembered email
    const remember = localStorage.getItem('rememberMe');
    if (remember === 'true') {
      this.email = localStorage.getItem('rememberedEmail') || '';
      this.rememberMe = true;
    }
  }

  ngOnInit() {
    // ❌ DO NOT clear tokens here
    // Keep session for persistent login
  }

  login() {

    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {

        // ⭐ SAVE BOTH TOKENS
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);

        // REMEMBER ME LOGIC
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', this.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
        }

        // DECODE ROLE
        const payload = JSON.parse(atob(res.token.split('.')[1]));
        const role =
          payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          || payload['role'];

        if (!role) {
          this.errorMsg = 'Invalid login response';
          this.isLoading = false;
          return;
        }

        localStorage.setItem('role', role.toUpperCase());

        // REDIRECT BY ROLE
        const roleUpper = role.toUpperCase();

        if (roleUpper === 'SUPERADMIN') {
          this.router.navigate(['/superadmin']);

        } else if (roleUpper === 'ADMIN') {
          this.router.navigate(['/admin']);

        } else {
          this.router.navigate(['/']);
        }

        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Invalid email or password';
        this.isLoading = false;
      }
    });
  }

  closeLogin() {
    this.router.navigate(['/']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}