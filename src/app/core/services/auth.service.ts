import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

import { API_URL } from '../config/api.config';
import { User } from '../models/user.model';

interface UserResponse {
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  register(name: string, email: string, password: string): Observable<User> {
    return this.http
      .post<UserResponse>(`${API_URL}/auth/register`, { name, email, password })
      .pipe(
        map((res) => res.user),
        tap((user) => this.userSubject.next(user))
      );
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<UserResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(
        map((res) => res.user),
        tap((user) => this.userSubject.next(user))
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/logout`, {}).pipe(
      catchError(() => of(undefined)),
      tap(() => this.clearSession()),
      map(() => undefined)
    );
  }

  loadSession(): Observable<User | null> {
    return this.http.get<UserResponse>(`${API_URL}/auth/me`).pipe(
      map((res) => res.user),
      catchError(() => of(null)),
      tap((user) => this.userSubject.next(user))
    );
  }

  refreshSession(): Observable<User> {
    return this.http
      .post<UserResponse>(`${API_URL}/auth/refresh-tokens`, {})
      .pipe(
        map((res) => res.user),
        tap((user) => this.userSubject.next(user))
      );
  }

  clearSession(): void {
    this.userSubject.next(null);
  }
}
