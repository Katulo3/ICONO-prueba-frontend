import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'users',
    canActivate: [adminGuard],
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
  },
  { path: '**', redirectTo: 'products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
