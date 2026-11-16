import { Routes } from '@angular/router';
import { employeeGuard } from './core/guards/employee-guard';
import { customerGuard } from './core/guards/customer-guard';

export const routes: Routes = [
  // ==========================================
  // ROTAS PÚBLICAS DE TELA CHEIA 
  // ==========================================
  {
    path: '',
    loadComponent: () => import('./features/landing-page/landing-page').then(c => c.LandingPage),
    title: 'Renova Bazar | A moda que faz o bem',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(c => c.Login),
    title: 'Login | Renova Bazar',
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./features/customer/sign-up/sign-up').then(c => c.SignUp),
    title: 'Faça parte do Renova',
  },

  // ==========================================
  // ROTAS INTERNAS DA APLICAÇÃO (Com Sidebar)
  // ==========================================
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: 'catalog',
        loadComponent: () => import('./features/catalog/catalog').then(c => c.Catalog),
        title: 'Produtos | Renova Bazar',
      },

      {
        path: '',
        canActivate: [customerGuard],
        children: [
          {
            path: 'cart',
            loadComponent: () => import('./features/customer/cart/cart').then(c => c.Cart),
            title: 'Meu Carrinho | Renova Bazar',
          },
        ],
      },

      {
        path: 'employee',
        canActivate: [employeeGuard],
        children: [
          {
            path: 'new-product',
            loadComponent: () => import('./features/employee/new-product/new-product').then(c => c.NewProduct),
            title: 'Cadastrar Produto | Renova Bazar',
          },
          {
            path: 'create-employee',
            loadComponent: () => import('./features/employee/create-employee/create-employee').then(c => c.CreateEmployee),
            title: 'Cadastrar Funcionário | Renova Bazar',
          },
        ],
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];