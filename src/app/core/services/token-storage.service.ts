import { Injectable } from '@angular/core';

import { AuthTokens } from '../models/auth-tokens.model';

const STORAGE_KEY = 'auth_tokens';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  get accessToken(): string | null {
    return this.read()?.access.token ?? null;
  }

  get refreshToken(): string | null {
    return this.read()?.refresh.token ?? null;
  }

  save(tokens: AuthTokens): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  private read(): AuthTokens | null {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}
