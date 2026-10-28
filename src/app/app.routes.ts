import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    // Lazy Loading: o código da Landing Page só é descarregado se o utilizador aceder a esta rota
    loadComponent: () => import('./features/landing-page/landing-page').then(c => c.LandingPage),
    title: 'Renova Bazar | A moda que faz o bem'
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(c => c.Login),
    title: 'Login | Renova Bazar'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];