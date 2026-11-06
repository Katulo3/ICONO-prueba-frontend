import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../../core/config/api.config';
import { PaginatedResponse } from '../../../core/models/pagination.model';
import { Product, ProductInput, ProductQuery } from '../models/product.model';

@Injectable()
export class ProductService {
  private readonly url = `${API_URL}/products`;

  constructor(private http: HttpClient) {}

  list(query: ProductQuery): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http.get<PaginatedResponse<Product>>(this.url, { params });
  }

  get(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  create(data: ProductInput): Observable<Product> {
    return this.http.post<Product>(this.url, data);
  }

  update(id: string, data: Partial<ProductInput>): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
