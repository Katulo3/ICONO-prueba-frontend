import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { AuthService } from './services/auth.service';
import { CredentialsInterceptor } from './interceptors/credentials.interceptor';
import { AuthRefreshInterceptor } from './interceptors/auth-refresh.interceptor';

export function restoreSession(auth: AuthService) {
  return () => firstValueFrom(auth.loadSession());
}

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthRefreshInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: restoreSession, deps: [AuthService], multi: true }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('CoreModule ya fue importado. Impórtalo solo en AppModule.');
    }
  }
}
