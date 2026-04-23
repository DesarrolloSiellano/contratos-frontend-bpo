import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 500) {
        console.error('⚠️ El servidor devolvió 500 - internal server error');

        localStorage.removeItem('token');
        router.navigate(['/exception/500']);
      }

      return throwError(() => error);
    })
  );
};
