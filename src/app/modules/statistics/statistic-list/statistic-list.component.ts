import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { getApiErrorMessage } from '../../../core/utils/api-error-message';
import { Statistic } from '../models/statistic.model';
import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-statistic-list',
  templateUrl: './statistic-list.component.html'
})
export class StatisticListComponent implements OnInit {
  statistics: Statistic[] = [];
  loading = false;

  constructor(
    private statisticsService: StatisticsService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  ngOnInit(): void {
    this.loading = true;
    this.statisticsService.list().subscribe({
      next: (res) => {
        this.statistics = res.results;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.snackBar.open(getApiErrorMessage(err, 'No se pudieron cargar las estadísticas'), 'Cerrar', { duration: 4000 });
      }
    });
  }
}
