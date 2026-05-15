import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BusyService } from '../services/busy-service';

export const busyInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  busyService.show();

  return next(req).pipe(finalize(() => busyService.hide()));
};
