import { Component, signal } from '@angular/core';
import { signUpRequest } from './sign-up-request';
import { UserRole } from '../../shared/interfaces/user-role';
import { Button } from '../../shared/components/button/button';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  imports: [Button, FormsModule, CommonModule],
  selector: 'app-sign-up',
  styleUrl: './sign-up.css',
  templateUrl: './sign-up.html',
})
export class SignUp {

  errorMessage = signal('')
  isLoading = signal(false)

  constructor(private authService: AuthService, private router: Router){}

  registerData: signUpRequest = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: UserRole.CUSTOMER
  }

  // confirmPassword: string = '';

  confirmPassword: string = '';

  navigateToLogin(): void {
   this.router.navigate(['/login']);
  }

  signUp(): void {

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage.set('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    if (!this.registerData.name || !this.registerData.email) {
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Erro ao realizar o cadastro. Verifique os dados e tente novamente.');
        console.error(error);
      }
    });
  }
}
