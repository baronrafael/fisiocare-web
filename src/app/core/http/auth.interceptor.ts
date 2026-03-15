import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_BASE_URL, AUTH_PUBLIC_PATHS } from '../config/api.config';
import { AuthService } from '../auth/auth.service';

const RETRY_HEADER = 'x-fc-auth-retry';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!request.url.startsWith(API_BASE_URL)) {
    return next(request);
  }

  if (AUTH_PUBLIC_PATHS.some((path) => request.url.endsWith(path))) {
    return next(request);
  }

  const accessToken = authService.getAccessToken();
  const authenticatedRequest = accessToken
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || request.headers.has(RETRY_HEADER)) {
        return throwError(() => error);
      }

      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        authService.logout();
        router.navigateByUrl('/auth/login');
        return throwError(() => error);
      }

      return authService.refreshAccessToken().pipe(
        switchMap((newAccessToken) => {
          const retryRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${newAccessToken}`,
              [RETRY_HEADER]: '1'
            }
          });

          return next(retryRequest);
        }),
        catchError((refreshError: unknown) => {
          authService.logout();
          router.navigateByUrl('/auth/login');
          return throwError(() => refreshError);
        })
      );
    })
  );
};
