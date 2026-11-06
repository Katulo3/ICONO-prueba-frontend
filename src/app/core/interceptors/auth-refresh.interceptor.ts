import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, catchError, finalize, share, switchMap, throwError } from 'rxjs';

import { API_URL } from '../config/api.config';
import { AuthService } from '../services/auth.service';

const SKIPPED_PATHS = ['/auth/login', '/auth/register', '/auth/refresh-tokens', '/auth/logout'];

@Injectable()
export class AuthRefreshInterceptor implements HttpInterceptor {
  private refresh$: Observable<unknown> | null = null;

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: unknown) => {
        if (!this.shouldRefresh(request, error)) {
          return throwError(() => error);
        }
        return this.getRefresh().pipe(
          catchError(() => {
            this.injector.get(AuthService).clearSession();
            return throwError(() => error);
          }),
          switchMap(() => next.handle(request))
        );
      })
    );
  }

  private shouldRefresh(request: HttpRequest<unknown>, error: unknown): boolean {
    return (
      error instanceof HttpErrorResponse &&
      error.status === 401 &&
      request.url.startsWith(API_URL) &&
      !SKIPPED_PATHS.some((path) => request.url.includes(path))
    );
  }

  /** Comparte una única petición de refresh entre todas las peticiones concurrentes que fallen con 401. */
  private getRefresh(): Observable<unknown> {
    if (!this.refresh$) {
      this.refresh$ = this.injector
        .get(AuthService)
        .refreshSession()
        .pipe(
          finalize(() => (this.refresh$ = null)),
          share()
        );
    }
    return this.refresh$;
  }
}
