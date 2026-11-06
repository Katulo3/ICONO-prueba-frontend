import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { Product, ProductInput } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  readonly form: FormGroup;
  readonly productId: string | null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]]
    });
  }

  get isEdit(): boolean {
    return this.productId !== null;
  }

  ngOnInit(): void {
    if (this.productId) {
      this.loading = true;
      this.productService.get(this.productId).subscribe({
        next: (product: Product) => {
          this.form.patchValue(product);
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.notify(err.error?.message ?? 'No se pudo cargar el producto');
          this.router.navigate(['/products']);
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const body: ProductInput = this.form.getRawValue();
    const request$: Observable<Product> = this.productId
      ? this.productService.update(this.productId, body)
      : this.productService.create(body);

    request$.subscribe({
      next: () => {
        this.notify(this.isEdit ? 'Producto actualizado' : 'Producto creado');
        this.router.navigate(['/products']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'No se pudo guardar el producto';
      }
    });
  }

  private notify(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}
