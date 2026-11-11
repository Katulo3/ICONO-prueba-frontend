import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Dates are ISO strings (YYYY-MM-DD), so lexical comparison matches chronological order.
export const dateRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const dateFrom: string = group.get('dateFrom')?.value ?? '';
  const dateTo: string = group.get('dateTo')?.value ?? '';
  return dateFrom && dateTo && dateTo < dateFrom ? { dateRange: true } : null;
};
