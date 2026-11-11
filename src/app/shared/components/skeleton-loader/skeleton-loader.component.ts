import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html'
})
export class SkeletonLoaderComponent {
  @Input() rows = 5;
  @Input() columns = 4;

  get rowItems(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }

  get columnItems(): number[] {
    return Array.from({ length: this.columns }, (_, i) => i);
  }
}
