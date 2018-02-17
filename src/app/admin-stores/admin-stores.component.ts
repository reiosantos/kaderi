import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services/alert.service';
import {User} from '../_models/user';
import {StoreService} from '../_services/store.service';
import {Store} from '../_models/store';
import {isBoolean, isNullOrUndefined} from 'util';
import {environment} from '../../environments/environment.prod';

@Component({
	selector: 'app-admin-stores',
	templateUrl: './admin-stores.component.html',
	styleUrls: ['./admin-stores.component.css']
})
export class AdminStoresComponent implements OnInit {
	user: User;
	stores: Store[];
	storeForm: FormGroup;
	storeSubmitted = false;
	savingStore= false;
	storeStatus: string;
	storeReceived = false;
	store_id = 0;
	store_name = '';

	constructor(
		private storeService: StoreService,
		private alertService: AlertService,
		private formBuilder: FormBuilder,
	) {
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		this.storeForm = formBuilder.group({ store_name: ['', Validators.compose([Validators.required])]});
	}

	ngOnInit() {
		this.store_id = this.user.store_id;
		this.refreshStores();
	}

	saveStore() {
		this.storeSubmitted = true;
		if (this.storeForm.valid) {
			this.savingStore = true;
			const st = this.storeForm.controls.store_name.value;
			this.storeService.insertStore(st).subscribe(
				data => {
					if (data && data.data){
						this.storeStatus = 'New Store has been added.';
						this.storeReceived = true;
						this.refreshStores();
					}else {
						this.storeReceived = false;
						this.storeStatus = 'sorry! Store could not be saved. Please try again.';
					}
					this.storeSubmitted = false;
					this.savingStore = false;
				},
				error => {
					this.storeStatus = 'sorry! Store could not be saved. Please try again. ';
					this.savingStore = false;
					this.storeReceived = false;
				}
			);
		}
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

	change() {
		for (let s = 0; s < this.stores.length; s++) {
			const store = this.stores[s];
			if (store.id === this.store_id){
				this.store_name = store.store_name;
			}
		}
	}
}
