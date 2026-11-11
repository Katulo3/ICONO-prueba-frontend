import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { getApiErrorMessage } from '../../../core/utils/api-error-message';
import { CHART_TYPE_OPTIONS, findSource, STATISTIC_SOURCES, StatisticOption } from '../config/statistic-sources';
import { StatisticChartType, StatisticCreateInput } from '../models/statistic.model';
import { StatisticsService } from '../services/statistics.service';
import { dateRangeValidator } from '../validators/date-range.validator';

@Component({
  selector: 'app-statistic-form',
  templateUrl: './statistic-form.component.html'
})
export class StatisticFormComponent {
  readonly form: FormGroup;
  readonly chartTypes = CHART_TYPE_OPTIONS;
  readonly sources = STATISTIC_SOURCES;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private statisticsService: StatisticsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    const firstSource = STATISTIC_SOURCES[0];
    this.form = this.fb.nonNullable.group(
      {
        title: ['', [Validators.required, Validators.maxLength(120)]],
        chartType: ['bar' as StatisticChartType, Validators.required],
        source: [firstSource.value, Validators.required],
        compareBy: [firstSource.compareBy[0].value, Validators.required],
        dateFrom: [''],
        dateTo: ['']
      },
      { validators: dateRangeValidator }
    );
  }

  get compareOptions(): StatisticOption[] {
    return findSource(this.form.controls['source'].value)?.compareBy ?? [];
  }

  onSourceChange(source: string): void {
    const first = findSource(source)?.compareBy[0];
    this.form.controls['compareBy'].setValue(first?.value ?? '');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, chartType, source, compareBy, dateFrom, dateTo } = this.form.getRawValue();
    const body: StatisticCreateInput = { title: title.trim(), chartType, source, compareBy };
    if (dateFrom) body.dateFrom = dateFrom;
    if (dateTo) body.dateTo = dateTo;

    this.loading = true;
    this.statisticsService.create(body).subscribe({
      next: () => {
        this.snackBar.open('Estadística creada', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/statistics']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.snackBar.open(getApiErrorMessage(err, 'No se pudo crear la estadística'), 'Cerrar', { duration: 5000 });
      }
    });
  }
}
