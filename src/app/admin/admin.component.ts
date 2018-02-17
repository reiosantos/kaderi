import { Component, OnInit } from '@angular/core';
import {User} from '../_models/user';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment.prod';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

	user: User;
	today: any;

	usersView = false;
	storesView = true;
	commentsView = false;

	constructor(
		private router: Router,
	) {
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		if (this.user && !this.user.is_admin){
			this.router.navigate(['/home']);
		}
	}

	move(to: string) {
		switch (to){
			case 'users':
				this.commentsView = false;
				this.storesView = false;
				this.usersView = true;
				break;
			case 'stores':
				this.commentsView = false;
				this.usersView = false;
				this.storesView = true;
				break;
			case 'comments':
				this.usersView = false;
				this.storesView = false;
				this.commentsView = true;
				break;
			default:
				this.commentsView = false;
				this.usersView = false;
				this.storesView = true;
		}
	}

	ngOnInit() {
		const d =  new Date();
		this.today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
	}

}
