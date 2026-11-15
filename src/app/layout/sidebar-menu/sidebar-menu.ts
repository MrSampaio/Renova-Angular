import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserRole } from '../../shared/models/user-role';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: UserRole[];
}

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar-menu',
  styleUrl: './sidebar-menu.css',
  templateUrl: './sidebar-menu.html',
})
export class SidebarMenu implements OnInit {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly isLoggedIn = computed(() => this.authService.currentUser() !== null);

  menuItems: MenuItem[] = [
    {
      label: 'Área de produtos',
      icon: 'fa-solid fa-box-open',
      route: '/catalog',
    },
    {
      label: 'Meus pedidos',
      icon: 'fa-solid fa-cart-shopping',
      route: '/my-orders',
      roles: [UserRole.CUSTOMER],
    },
    {
      label: 'Realizar novo pedido',
      icon: 'fa-regular fa-circle-plus',
      route: '/new-order',
      roles: [UserRole.CUSTOMER],
    },
    {
      label: 'Visualizar pedidos',
      icon: 'fa-regular fa-rectangle-list',
      route: '/admin/orders',
      roles: [UserRole.EMPLOYEE],
    },
    {
      label: 'Cadastrar produto',
      icon: 'fa-solid fa-box-archive',
      route: '/employee/new-product',
      roles: [UserRole.EMPLOYEE],
    },
    {
      label: 'Cadastrar funcionário',
      icon: 'fa-solid fa-users',
      route: '/admin/new-employee',
      roles: [UserRole.EMPLOYEE],
    },
    {
      label: 'Minha conta',
      icon: 'fa-regular fa-user',
      route: '/profile',
    },
    {
      label: 'Ajuda',
      icon: 'fa-regular fa-circle-question',
      route: '/help',
    },
  ];

  ngOnInit(): void {
    if (!this.authService.currentUser()) {
      this.authService.fetchUser().subscribe({
        error: (err) => console.error('Erro ao carregar perfil:', err),
      });
    }
  }

  hasPermission(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) return true;

    const user = this.authService.currentUser();
    if (!user) return false;

    return item.roles.includes(user.userRole);
  }

  logout(): void {
    this.authService.logout('/login');
  }
}