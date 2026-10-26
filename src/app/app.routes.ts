import { Routes } from '@angular/router';
import { LandingPage } from './features/landing-page/landing-page';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
  { path: '', component: LandingPage },
  // A string 'login' é o que usaremos na navegação
  { path: 'login', component: Login } 
];
