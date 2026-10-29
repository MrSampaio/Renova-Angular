import { Component, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth-service';
import { AuthRequest } from '../../shared/interfaces/auth-request';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, Button],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  constructor(private authService: AuthService, private router: Router){}

  loginData: AuthRequest = {
    email: '',
    password: ''
  }

  errorMessage = signal('');
  isLoading = signal(false);

  navigateToSignUp(){
    this.router.navigate(['/sign-up']);
  }

  login(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginData).subscribe({
      next: () => {
        // localStorage.setItem('token', response.token);
        this.isLoading.set(false);
        this.router.navigate(['/catalog']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('E-mail ou senha incorretos. Tente novamente.');
        console.error(error);
      }
      
    });
  }
}
