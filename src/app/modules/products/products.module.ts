import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent
  ],
  imports: [
    SharedModule,
    ProductsRoutingModule
  ],
  providers: [
    ProductService
  ]
})
export class ProductsModule { }
