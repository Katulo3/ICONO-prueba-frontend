import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';

import { API_URL } from '../config/api.config';

export const REQUEST_TIMEOUT_MS = 15000;

/** Corta las peticiones a la API que no responden, para que ninguna pantalla quede cargando indefinidamente. */
@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(API_URL)) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      timeout({
        each: REQUEST_TIMEOUT_MS,
        with: () =>
          throwError(
            () => new HttpErrorResponse({ status: 408, statusText: 'Request Timeout', url: request.url })
          )
      })
    );
  }
}
