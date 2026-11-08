import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
// import { routes } from '../../app.routes';
import { AuthService } from '../../shared/services/auth.service';

export const employeeGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();

  if (!user || user.userRole !== 'EMPLOYEE') {
    router.navigate(['/login']);
    return false;
  }

  if(user) { 
    
  }

  return true;
};
