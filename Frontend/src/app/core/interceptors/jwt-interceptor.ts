import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AccountService } from '../services/account-service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const user = accountService.currentUser();
  const token = user?.token ?? localStorage.getItem('token');

  if(token){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('/account/login')
      ) {
        accountService.logout();
        void router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
        });
      }

      return throwError(() => error);
    })
  );
};
  
