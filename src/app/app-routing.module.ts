import { OfersComponent } from './pages/ofers/ofers.component';
import { AdminOferComponent } from './admin/admin-ofer/admin-ofer.component';
import { AdminRequestsComponent } from './admin/admin-requests/admin-requests.component';
import { AdminTypeComponent } from './admin/admin-type/admin-type.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { BasketComponent } from './pages/basket/basket.component';
import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductsComponent } from './pages/products/products.component';


const routes: Routes = [
  { path: '',  redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'ofers', component: OfersComponent },
  { path: 'product/:category', component: ProductsComponent},
  { path: 'product/:category/:type', component: ProductsComponent},
  { path: 'product/:category/:id', component: ProductDetailsComponent},
  { path: 'payment', component: PaymentComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'admin', component: AdminComponent, children: [
  { path: '',  redirectTo: 'category', pathMatch: 'full' },
  { path: 'category', component: AdminCategoryComponent },
  { path: 'products', component: AdminProductsComponent },
  { path: 'orders', component: AdminOrdersComponent },
  { path: 'type', component: AdminTypeComponent },
  { path: 'requests', component: AdminRequestsComponent },
  { path: 'ofer', component: AdminOferComponent },
  ] },
];

@NgModule({
  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
