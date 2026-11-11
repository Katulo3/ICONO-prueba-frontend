import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';

import { User, UserRole } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { getApiErrorMessage } from '../../../core/utils/api-error-message';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  readonly displayedColumns = ['name', 'email', 'role', 'actions'];
  readonly pageSizeOptions = [5, 10, 25];
  readonly roles: { value: UserRole | ''; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'user', label: 'Usuario' },
    { value: 'admin', label: 'Administrador' }
  ];
  readonly filterForm: FormGroup;

  users: User[] = [];
  totalResults = 0;
  page = 1;
  pageSize = 10;
  sortBy = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    public auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.nonNullable.group({
      name: [''],
      role: ['' as UserRole | '']
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
    this.filterForm.reset({ name: '', role: '' });
    this.applyFilters();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  onSort(sort: Sort): void {
    this.sortBy = sort.direction ? `${sort.active}:${sort.direction}` : '';
    this.page = 1;
    this.load();
  }

  isCurrentUser(user: User): boolean {
    return this.auth.currentUser?.id === user.id;
  }

  confirmDelete(user: User): void {
    const data: ConfirmDialogData = {
      title: 'Eliminar usuario',
      message: `¿Eliminar a "${user.name}" (${user.email})? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar'
    };

    this.dialog
      .open(ConfirmDialogComponent, { data })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.remove(user);
        }
      });
  }

  private load(): void {
    const { name, role } = this.filterForm.getRawValue();
    this.loading = true;

    this.usersService
      .list({ page: this.page, limit: this.pageSize, name: name.trim(), role, sortBy: this.sortBy })
      .subscribe({
        next: (res) => {
          this.users = res.results;
          this.totalResults = res.totalResults;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.notify(getApiErrorMessage(err, 'No se pudieron cargar los usuarios'));
        }
      });
  }

  private remove(user: User): void {
    this.usersService.remove(user.id).subscribe({
      next: () => {
        this.notify('Usuario eliminado');
        this.load();
      },
      error: (err: HttpErrorResponse) => this.notify(getApiErrorMessage(err, 'No se pudo eliminar el usuario'))
    });
  }

  private notify(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}
