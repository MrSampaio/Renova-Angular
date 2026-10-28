import { Component } from '@angular/core';
import { AuthService } from './auth-service';
import { AuthRequest } from './auth-request';
import { Router } from '@angular/router';
import { tick } from '@angular/core/testing';

@Component({
  imports: [AuthService],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  constructor(private authService: AuthService, private router: Router){}

  loginData: AuthRequest = {
    email: '',
    password: ''
  }

  errorMessage: string = '';
  isLoading: boolean = false;

  login(authRequest: AuthRequest): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.isLoading = false;

        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'E-mail ou senha incorretos. Tente novamente.';
        console.error(error);
      }
      
    });
  }
}
