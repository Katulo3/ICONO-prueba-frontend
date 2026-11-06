import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { User, UserRole } from '../../../core/models/user.model';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  readonly form: FormGroup;
  readonly userId: string | null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(4)]],
      role: ['user' as UserRole, Validators.required]
    });
  }

  get isEdit(): boolean {
    return this.userId !== null;
  }

  ngOnInit(): void {
    if (this.isEdit) {
      this.form.controls['role'].disable();
    } else {
      this.form.controls['password'].setValidators([Validators.required, Validators.minLength(4)]);
      this.form.controls['password'].updateValueAndValidity();
    }

    if (this.userId) {
      this.loading = true;
      this.usersService.get(this.userId).subscribe({
        next: (user: User) => {
          this.form.patchValue({ name: user.name, email: user.email, role: user.role });
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.notify(err.error?.message ?? 'No se pudo cargar el usuario');
          this.router.navigate(['/users']);
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
    const { name, email, password, role } = this.form.getRawValue();

    if (this.userId) {
      const body = password ? { name, email, password } : { name, email };
      this.usersService.update(this.userId, body).subscribe({
        next: () => this.finish('Usuario actualizado'),
        error: (err: HttpErrorResponse) => this.fail(err, 'No se pudo actualizar el usuario')
      });
    } else {
      this.usersService.create({ name, email, password, role }).subscribe({
        next: () => this.finish('Usuario creado'),
        error: (err: HttpErrorResponse) => this.fail(err, 'No se pudo crear el usuario')
      });
    }
  }

  private finish(message: string): void {
    this.notify(message);
    this.router.navigate(['/users']);
  }

  private fail(err: HttpErrorResponse, fallback: string): void {
    this.loading = false;
    this.errorMessage = err.error?.message ?? fallback;
  }

  private notify(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}
