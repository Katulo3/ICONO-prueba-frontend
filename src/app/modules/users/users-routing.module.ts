import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ProfileComponent } from './profile/profile.component';
import { adminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
  { path: '', component: UserListComponent, canActivate: [adminGuard] },
  { path: 'new', component: UserFormComponent, canActivate: [adminGuard] },
  { path: 'profile', component: ProfileComponent },
  { path: ':id/edit', component: UserFormComponent, canActivate: [adminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
