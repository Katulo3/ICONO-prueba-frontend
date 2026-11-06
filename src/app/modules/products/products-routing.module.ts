import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminGuard } from '../../core/guards/admin.guard';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'new', component: ProductFormComponent, canActivate: [adminGuard] },
  { path: ':id/edit', component: ProductFormComponent, canActivate: [adminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
