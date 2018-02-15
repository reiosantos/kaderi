import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {routing} from './app.routing';
import {AlertComponent} from './_directives/alert.component';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './_guards/auth.guard';
import {AuthenticationService} from './_services/authentication.service';
import {AlertService} from './_services/alert.service';
import {UserService} from './_services/user.service';
import {ProductService} from './_services/product.service';
import {SaleService} from './_services/sale.service';
import {CommentService} from './_services/comment.service';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminSalesComponent } from './admin-sales/admin-sales.component';
import { AdminCommentsComponent } from './admin-comments/admin-comments.component';
import { AdminStoresComponent } from './admin-stores/admin-stores.component';
import {StoreService} from './_services/store.service';


@NgModule({
	declarations: [
		AppComponent,
		AdminComponent,
		HomeComponent,
		LoginComponent,
		AlertComponent,
		AdminProductsComponent,
		AdminUsersComponent,
		AdminSalesComponent,
		AdminCommentsComponent,
		AdminStoresComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		routing,
		HttpClientModule,
	],
	providers: [
		AuthGuard,
		AlertService,
		AuthenticationService,
		UserService,
		ProductService,
		SaleService,
		CommentService,
		StoreService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtInterceptor,
			multi: true
		},
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
