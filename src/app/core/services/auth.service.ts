import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

import { API_URL } from '../config/api.config';
import { AuthTokens } from '../models/auth-tokens.model';
import { User } from '../models/user.model';
import { TokenStorageService } from './token-storage.service';

interface UserResponse {
  user: User;
}

interface AuthResponse extends UserResponse {
  tokens: AuthTokens;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  register(name: string, email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/register`, { name, email, password })
      .pipe(
        tap((res) => this.tokenStorage.save(res.tokens)),
        map((res) => res.user),
        tap((user) => this.userSubject.next(user))
      );
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(
        tap((res) => this.tokenStorage.save(res.tokens)),
        map((res) => res.user),
        tap((user) => this.userSubject.next(user))
      );
  }

  logout(): Observable<void> {
    const refreshToken = this.tokenStorage.refreshToken;
    return this.http.post<void>(`${API_URL}/auth/logout`, { refreshToken }).pipe(
      catchError(() => of(undefined)),
      tap(() => this.clearSession()),
      map(() => undefined)
    );
  }

  loadSession(): Observable<User | null> {
    if (!this.tokenStorage.accessToken) {
      return of(null);
    }
    return this.http.get<UserResponse>(`${API_URL}/auth/me`).pipe(
      map((res) => res.user),
      catchError(() => of(null)),
      tap((user) => this.userSubject.next(user))
    );
  }

  clearSession(): void {
    this.tokenStorage.clear();
    this.userSubject.next(null);
  }
}