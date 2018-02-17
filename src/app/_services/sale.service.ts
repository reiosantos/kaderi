import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Sale} from '../_models/sale';

@Injectable()
export class SaleService {
	constructor(private http: HttpClient) { }

	getAll(store_id: any) {
		return this.http.get<any>(environment.api + '?action=load&table=sales&store=' + store_id);
	}

	createOrUpdate(sale: Sale) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'sales', sale: JSON.stringify(sale)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=sales&id=' + id);
	}
}
