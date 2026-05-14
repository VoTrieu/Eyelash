import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        toastService.showError('Something went wrong. Please try again.');
        return throwError(() => error);
      }

      if (error.status === 401) {
        return throwError(() => error);
      }

      if (error.status === 404) {
        toastService.showError('The page or resource you requested was not found.');
        void router.navigate(['/not-found']);
        return throwError(() => error);
      }

      if (error.status === 500) {
        toastService.showError('The server had a problem. Please try again later.');
        void router.navigate(['/server-error']);
        return throwError(() => error);
      }

      toastService.showError(getErrorMessage(error));
      return throwError(() => error);
    })
  );
};

function getErrorMessage(error: HttpErrorResponse) {
  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  if (error.error?.message) {
    return error.error.message;
  }

  if (error.error?.title) {
    return error.error.title;
  }

  if (error.error?.errors) {
    return Object.values(error.error.errors).flat().join('\n');
  }

  return statusMessages[error.status] ?? 'Something went wrong. Please try again.';
}

const statusMessages: Record<number, string> = {
  0: 'Could not connect to the server. Please check your connection.',
  400: 'The request could not be completed. Please check the information and try again.',
  403: 'You do not have permission to do that.',
  500: 'The server had a problem. Please try again later.',
};
