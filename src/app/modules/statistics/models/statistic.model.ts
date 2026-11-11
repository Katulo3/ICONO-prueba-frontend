export type StatisticChartType = 'pie' | 'bar';

export interface Statistic {
  id: string;
  title: string;
  chartType: StatisticChartType;
  source: string;
  compareBy: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface StatisticData {
  id: string;
  title: string;
  chartType: StatisticChartType;
  source: string;
  compareBy: string;
  labels: string[];
  values: number[];
  total: number;
}

export interface StatisticCreateInput {
  title: string;
  chartType: StatisticChartType;
  source: string;
  compareBy: string;
  dateFrom?: string;
  dateTo?: string;
}
