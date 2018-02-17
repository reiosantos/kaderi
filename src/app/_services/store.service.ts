import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Store} from '../_models/store';

@Injectable()
export class StoreService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=stores');
	}

	insertStore(store: Store) {
		return this.http.post<any>(environment.api, { action: 'saveStore', table: 'stores', store: JSON.stringify(store)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=stores&id=' + id);
	}
}
