import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../config/api.config';

@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(API_URL)) {
      return next.handle(request);
    }
    return next.handle(request.clone({ withCredentials: true }));
  }
}
