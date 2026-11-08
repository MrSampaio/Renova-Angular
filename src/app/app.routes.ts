import { Routes } from '@angular/router';
import { employeeGuard } from './core/guards/employee-guard';

export const routes: Routes = [
  // rotas de tela cheia (sem sidebar)
  { 
    path: '', 
    loadComponent: () => import('./features/landing-page/landing-page').then(c => c.LandingPage),
    title: 'Renova Bazar | A moda que faz o bem'
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/login/login').then(c => c.Login),
    title: 'Login | Renova Bazar'
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./features/sign-up/sign-up').then(c => c.SignUp),
    title: 'Faça parte do Renova'
  },

  // rotas Internas da Aplicação
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: 'catalog',
        loadComponent: () => import('./features/catalog/catalog').then(c => c.Catalog),
        title: 'Produtos | Renova Bazar'
      },
      {
        path: 'employee',
        canActivate: [employeeGuard],
        children: [
          {
            path: 'new-product',
            loadComponent: () => import('./features/employee/new-product/new-product').then(c => c.NewProduct),
            title: 'Cadastrar Produto',
          },
          {
            path: 'create-employee',
            loadComponent: () => import('./features/employee/create-employee/create-employee').then(c => c.CreateEmployee),
            title: 'Cadastrar Funcionário'
          }
        ]
      }
    ]
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];