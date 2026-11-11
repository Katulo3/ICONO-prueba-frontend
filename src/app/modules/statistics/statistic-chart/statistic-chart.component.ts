import { Component, Input, OnChanges } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

import { StatisticChartType } from '../models/statistic.model';

// ng2-charts does not register the Chart.js controllers, so pie and bar need this before rendering.
Chart.register(...registerables);

@Component({
  selector: 'app-statistic-chart',
  templateUrl: './statistic-chart.component.html'
})
export class StatisticChartComponent implements OnChanges {
  @Input() chartType: StatisticChartType = 'bar';
  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() label = '';

  chartData: ChartData = { labels: [], datasets: [] };
  chartOptions: ChartOptions = {};

  ngOnChanges(): void {
    this.chartData = {
      labels: this.labels,
      datasets: [{ label: this.label, data: this.values }]
    };
    this.chartOptions = {
      responsive: true,
      aspectRatio: this.chartType === 'bar' ? 1.5 : 2,
      plugins: { legend: { position: 'bottom' } }
    };
  }
}
