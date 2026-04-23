import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  const user = accountService.currentUser();
  const isTokenValid = accountService.isTokenValid();

  if (user && isTokenValid) {
    // User already logged in, redirect to admin dashboard
    return router.createUrlTree(['/admin/main/dashboard']);
  }

  return true;
};
