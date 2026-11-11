import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../../core/config/api.config';
import { PaginatedResponse } from '../../../core/models/pagination.model';
import { Statistic, StatisticCreateInput, StatisticData } from '../models/statistic.model';

@Injectable()
export class StatisticsService {
  private readonly url = `${API_URL}/statistics`;

  constructor(private http: HttpClient) {}

  list(limit = 50): Observable<PaginatedResponse<Statistic>> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<PaginatedResponse<Statistic>>(this.url, { params });
  }

  create(data: StatisticCreateInput): Observable<Statistic> {
    return this.http.post<Statistic>(this.url, data);
  }

  data(id: string): Observable<StatisticData> {
    return this.http.get<StatisticData>(`${this.url}/${id}/data`);
  }
}
