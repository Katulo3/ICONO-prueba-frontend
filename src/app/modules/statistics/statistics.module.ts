import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import { SharedModule } from '../../shared/shared.module';
import { adminGuard } from '../../core/guards/admin.guard';
import { StatisticCardComponent } from './statistic-card/statistic-card.component';
import { StatisticChartComponent } from './statistic-chart/statistic-chart.component';
import { StatisticFormComponent } from './statistic-form/statistic-form.component';
import { StatisticListComponent } from './statistic-list/statistic-list.component';
import { StatisticsService } from './services/statistics.service';

const routes: Routes = [
  { path: '', component: StatisticListComponent },
  { path: 'new', component: StatisticFormComponent, canActivate: [adminGuard] }
];

@NgModule({
  declarations: [
    StatisticListComponent,
    StatisticFormComponent,
    StatisticCardComponent,
    StatisticChartComponent
  ],
  imports: [
    SharedModule,
    NgChartsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    StatisticsService
  ]
})
export class StatisticsModule { }
