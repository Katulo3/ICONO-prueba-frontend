import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  readonly form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const { name, email, password } = this.form.getRawValue();

    this.auth.register(name, email, password).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.error?.message ?? 'No se pudo completar el registro';
      }
    });
  }
}
