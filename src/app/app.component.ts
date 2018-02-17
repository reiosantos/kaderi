import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {Router} from '@angular/router';
import {AuthenticationService} from './_services/authentication.service';
import {User} from './_models/user';
import {environment} from '../environments/environment.prod';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	title = 'Kaderi Sales System';
	isLoggedin: boolean;
	user: User = null;

	constructor(
		public router: Router,
		private authService: AuthenticationService,
		private location: Location
	) {
		if (localStorage.getItem(environment.userStorageKey) == null){
			this.router.navigate(['/login']);
		}
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		this.isLoggedin = !!(this.user && this.user.token);
	}

	loginEmit(status) {
		this.isLoggedin = status;
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		if (this.isLoggedin) {
			location.reload();
		}
	}

	logout() {
		this.authService.logout();
		this.isLoggedin = false;
		location.reload();
	}
}
