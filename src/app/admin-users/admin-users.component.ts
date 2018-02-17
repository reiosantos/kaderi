import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {AlertService} from '../_services/alert.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {isBoolean, isNullOrUndefined} from 'util';
import {EmailValidator} from '../../validators/email';
import {Store} from '../_models/store';
import {StoreService} from '../_services/store.service';
import {environment} from '../../environments/environment.prod';

@Component({
	selector: 'app-admin-users',
	templateUrl: './admin-users.component.html',
	styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

	user: User;
	modalUser: User;
	userOutput: User[];
	stores: Store[];
	addUserForm: FormGroup;

	loading = false;
	userSubmitted = false;

	constructor(
		private alertService: AlertService,
		private userService: UserService,
		private storeService: StoreService,
		private location: Location,
		private fb: FormBuilder
	) {
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		this.addUserForm = fb.group({
			f_name: ['', Validators.compose([Validators.required])],
			l_name: ['', Validators.compose([Validators.required])],
			email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
			contact: ['', Validators.compose([Validators.required])],
			password: ['', Validators.compose([Validators.required])],
			is_admin: [''],
			store_id: ['', Validators.compose([Validators.required])]
		});
		this.modalUser = new User();
	}

	ngOnInit() {
		this.refreshStores();
		this.refreshUsers();
	}

	userSubmit() {
		this.userSubmitted = true;
		if (this.addUserForm.valid) {
			this.loading = true;
			const us = new User();
			us.is_admin = this.addUserForm.controls.is_admin.value;
			us.password = this.addUserForm.controls.password.value;
			us.contact = this.addUserForm.controls.contact.value;
			us.email = this.addUserForm.controls.email.value;
			us.first_name = this.addUserForm.controls.f_name.value;
			us.last_name = this.addUserForm.controls.l_name.value;
			us.store_id = this.addUserForm.controls.store_id.value;
			if (this.modalUser) {
				us.id = this.modalUser.id;
			}
			this.userService.createOrUpdate(us).subscribe(
				data => {
					if (!data){
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data){
						if (this.modalUser) {
							this.alertService.success('user has been modified...', false);
						}else{
							this.alertService.success('new user has been registered...', false);
						}
						this.addUserForm.reset('');
						this.userSubmitted = false;
						this.modalUser = new User();
						this.refreshUsers();
					}else{
						this.alertService.error('Unable to add user....Try again');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Unable to save user...' + error.error);
					this.loading = false;
				});
		}
	}

	editUser(user: User) {
		this.modalUser = user;
	}

	deleteUser(user: User) {
		if (confirm('Are You sure To Delete This User ?')) {
			this.loading = true;
			this.userService.delete(user.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data){
						this.refreshUsers();
						this.alertService.success('User has been deleted...', false);
					}else{
						this.alertService.error('Sorry... Error occurred Unable to delete User');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete User');
					this.loading = false;
				}
			);
		}
	}

	refreshUsers() {
		this.userService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)){
					this.userOutput = data.data;
				}
			},
		);
	}

	refreshStores() {
		this.storeService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)){
					this.stores = data.data;
				}
			},
		);
	}
}
