import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  const user = accountService.currentUser();
  const isTokenValid = accountService.isTokenValid();

  if (user && isTokenValid) {
    const returnUrl = route.queryParamMap.get('returnUrl');

    if (user.roles.includes('Admin')) {
      return router.parseUrl(returnUrl || '/admin');
    }

    return router.parseUrl(returnUrl || '/');
  }

  return true;
};
