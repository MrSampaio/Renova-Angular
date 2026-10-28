import { Component, signal} from '@angular/core';
import { signUpRequest } from './sign-up-request';
import { UserRole } from '../../shared/interfaces/user-role';

@Component({
  imports: [],
  selector: 'app-sign-up',
  styleUrl: './sign-up.css',
  templateUrl: './sign-up.html',
})
export class SignUp {

  errorMessage = signal('')
  registerData: signUpRequest = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: UserRole.CUSTOMER
  }

  confirmPassword: string = '';

  signUp(): void {

  }
}
