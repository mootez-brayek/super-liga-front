import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, _state) => {
 const router = inject(Router);

  const expectedRoles: string[] = route.data?.['roles'] || [];
  const role = localStorage.getItem('role');

  if (role && expectedRoles.includes(role)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
