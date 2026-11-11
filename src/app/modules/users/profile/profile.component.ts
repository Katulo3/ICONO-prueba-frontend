import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { getApiErrorMessage } from '../../../core/utils/api-error-message';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  readonly form: FormGroup;
  loading = false;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (user) {
      this.form.patchValue({ name: user.name, email: user.email });
    }
  }

  submit(): void {
    const user = this.auth.currentUser;
    if (!user || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { name, email } = this.form.getRawValue();
    this.usersService.update(user.id, { name, email }).subscribe({
      next: () => {
        this.auth.loadSession().subscribe(() => {
          this.loading = false;
          this.snackBar.open('Perfil actualizado', 'Cerrar', { duration: 3000 });
        });
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.snackBar.open(getApiErrorMessage(err, 'No se pudo actualizar el perfil'), 'Cerrar', { duration: 5000 });
      }
    });
  }
}
