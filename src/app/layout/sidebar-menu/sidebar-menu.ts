import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserRole } from '../../shared/interfaces/user-role';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar-menu',
  styleUrl: './sidebar-menu.css',
  templateUrl: './sidebar-menu.html',
})
export class SidebarMenu {
  userRole = signal<UserRole>(UserRole.EMPLOYEE);

  constructor(private router: Router) {}

  logout(): void {
    // depois faz a lógica de limpar o cookie da sessão
    this.router.navigate(['/login']);
  }
}
