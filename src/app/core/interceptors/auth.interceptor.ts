import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

import { API_URL } from '../config/api.config';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

// Un 401 en estas rutas es un error de credenciales, no una sesión expirada.
const PUBLIC_PATHS = ['/auth/login', '/auth/register'];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenStorage: TokenStorageService,
    private injector: Injector,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(API_URL)) {
      return next.handle(request);
    }

    const token = this.tokenStorage.accessToken;
    const authRequest = token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

    return next.handle(authRequest).pipe(
      catchError((error: unknown) => {
        if (this.isSessionExpired(request, error)) {
          this.tokenStorage.clear();
          this.injector.get(AuthService).clearSession();
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        }
        return throwError(() => error);
      })
    );
  }

  private isSessionExpired(request: HttpRequest<unknown>, error: unknown): boolean {
    return (
      error instanceof HttpErrorResponse &&
      error.status === 401 &&
      !PUBLIC_PATHS.some((path) => request.url.includes(path))
    );
  }
}
