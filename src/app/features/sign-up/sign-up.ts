import { Component, signal } from '@angular/core';
import { signUpRequest } from './sign-up-request';
import { UserRole } from '../../shared/interfaces/user-role';
import { Button } from '../../shared/components/button/button';
import { FormsModule } from '@angular/forms'; // 1. Importe o FormsModule
import { CommonModule } from '@angular/common';

@Component({
  imports: [Button, FormsModule, CommonModule],
  selector: 'app-sign-up',
  styleUrl: './sign-up.css',
  templateUrl: './sign-up.html',
})
export class SignUp {

  errorMessage = signal('')
  isLoading = signal(false)

  constructor(){}


  registerData: signUpRequest = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: UserRole.CUSTOMER
  }

  // confirmPassword: string = '';

  confirmPassword: string = '';



  signUp(): void {
    // this.isLoading = true;
    // this.errorMessage = '';
  }
}
