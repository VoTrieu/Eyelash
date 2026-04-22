import { CanActivateChildFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { inject } from '@angular/core/primitives/di';
import { ToastService } from '../services/toast-service';

export const adminGuard: CanActivateChildFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastService = inject(ToastService);  
  const currentUser = accountService.currentUser();

  if (!currentUser || !currentUser.roles.includes('Admin')) {
    toastService.showError('Access denied. Admins only.');
    return false;
  }
  
  return true;
};
