import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Product} from '../_models/product';
import {User} from '../_models/user';

@Injectable()
export class ProductService {
	user: User = JSON.parse(localStorage.getItem(environment.userStorageKey));

	constructor(private http: HttpClient) { }

	getAll(store_id: any) {
		let status = 0;
		if (this.user.is_admin === true) {
			status = 1;
		}
		return this.http.get<any>(environment.api + '?action=load&table=products&store=' + store_id + '&user=' + status);
	}

	createOrUpdate(product: Product) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'products', product: JSON.stringify(product)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=products&id=' + id);
	}
}
