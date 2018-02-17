import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {AdminComponent} from './admin/admin.component';
import {AuthGuard} from './_guards/auth.guard';

const appRoutes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard]},
	{ path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
	{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	// otherwise redirect to home
	{ path: '**', redirectTo: '', canActivate: [AuthGuard] }
];

export const routing = RouterModule.forRoot(appRoutes, {useHash: true});
