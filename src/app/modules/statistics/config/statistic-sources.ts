import { StatisticChartType } from '../models/statistic.model';

export interface StatisticOption {
  value: string;
  label: string;
}

export interface StatisticSourceConfig extends StatisticOption {
  compareBy: StatisticOption[];
}

// To add a new data source, add an entry here and the matching source in the backend statistic.config.ts
export const STATISTIC_SOURCES: StatisticSourceConfig[] = [
  {
    value: 'users',
    label: 'Usuarios',
    compareBy: [
      { value: 'role', label: 'Rol (administradores y usuarios)' },
      { value: 'registered', label: 'Mes de registro' }
    ]
  },
  {
    value: 'products',
    label: 'Productos',
    compareBy: [{ value: 'category', label: 'Categoría' }]
  }
];

export const CHART_TYPE_OPTIONS: { value: StatisticChartType; label: string }[] = [
  { value: 'pie', label: 'Pastel (Pie)' },
  { value: 'bar', label: 'Barras (Bar)' }
];

export function findSource(value: string): StatisticSourceConfig | undefined {
  return STATISTIC_SOURCES.find((source) => source.value === value);
}

export function findCompareLabel(source: string, compareBy: string): string {
  return findSource(source)?.compareBy.find((option) => option.value === compareBy)?.label ?? compareBy;
}
