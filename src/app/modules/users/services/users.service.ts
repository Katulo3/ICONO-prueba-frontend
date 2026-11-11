import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../../core/config/api.config';
import { PaginatedResponse } from '../../../core/models/pagination.model';
import { User, UserRole } from '../../../core/models/user.model';

export interface UserQuery {
  page?: number;
  limit?: number;
  name?: string;
  role?: UserRole | '';
  sortBy?: string;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserUpdateInput {
  name: string;
  email: string;
  password?: string;
}

@Injectable()
export class UsersService {
  private readonly url = `${API_URL}/users`;

  constructor(private http: HttpClient) {}

  list(query: UserQuery): Observable<PaginatedResponse<User>> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http.get<PaginatedResponse<User>>(this.url, { params });
  }

  get(id: string): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(data: UserCreateInput): Observable<User> {
    return this.http.post<User>(this.url, data);
  }

  update(id: string, data: UserUpdateInput): Observable<User> {
    return this.http.patch<User>(`${this.url}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
