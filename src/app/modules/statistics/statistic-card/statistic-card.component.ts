import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { getApiErrorMessage } from '../../../core/utils/api-error-message';
import { findCompareLabel } from '../config/statistic-sources';
import { Statistic, StatisticData } from '../models/statistic.model';
import { StatisticsService } from '../services/statistics.service';

@Component({
  selector: 'app-statistic-card',
  templateUrl: './statistic-card.component.html'
})
export class StatisticCardComponent implements OnInit {
  @Input() statistic!: Statistic;

  data: StatisticData | null = null;
  loading = true;

  constructor(private statisticsService: StatisticsService, private snackBar: MatSnackBar) {}

  get compareLabel(): string {
    return findCompareLabel(this.statistic.source, this.statistic.compareBy);
  }

  ngOnInit(): void {
    this.statisticsService.data(this.statistic.id).subscribe({
      next: (data: StatisticData) => {
        this.data = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.snackBar.open(getApiErrorMessage(err, 'No se pudo cargar la estadística'), 'Cerrar', { duration: 4000 });
      }
    });
  }
}
