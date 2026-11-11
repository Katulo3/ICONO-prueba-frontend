import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { getApiErrorMessage } from '../../../core/utils/api-error-message';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  readonly displayedColumns = ['name', 'category', 'price', 'stock', 'actions'];
  readonly pageSizeOptions = [5, 10, 25];
  readonly filterForm: FormGroup;

  products: Product[] = [];
  totalResults = 0;
  page = 1;
  pageSize = 10;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.nonNullable.group({
      name: [''],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.load();
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  clearFilters(): void {
    this.filterForm.reset({ name: '', category: '' });
    this.applyFilters();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  confirmDelete(product: Product): void {
    const data: ConfirmDialogData = {
      title: 'Eliminar producto',
      message: `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar'
    };

    this.dialog
      .open(ConfirmDialogComponent, { data })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.remove(product);
        }
      });
  }

  private load(): void {
    const { name, category } = this.filterForm.getRawValue();
    this.loading = true;

    this.productService
      .list({ page: this.page, limit: this.pageSize, name: name.trim(), category: category.trim() })
      .subscribe({
        next: (res) => {
          this.products = res.results;
          this.totalResults = res.totalResults;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.notify(getApiErrorMessage(err, 'No se pudieron cargar los productos'));
        }
      });
  }

  private remove(product: Product): void {
    this.productService.remove(product.id).subscribe({
      next: () => {
        this.notify('Producto eliminado');
        this.load();
      },
      error: (err: HttpErrorResponse) => this.notify(getApiErrorMessage(err, 'No se pudo eliminar el producto'))
    });
  }

  private notify(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}
