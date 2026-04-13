import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const role = localStorage.getItem('role');

    return role && allowedRoles.includes(role)
      ? true
      : router.createUrlTree(['/login']);
  };
};
