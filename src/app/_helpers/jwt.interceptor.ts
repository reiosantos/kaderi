﻿import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// add authorization header with jwt token if available
		const currentUser = JSON.parse(localStorage.getItem(environment.userStorageKey));
		if (currentUser && currentUser.token) {
			request = request.clone({
				setHeaders: {
					// Authorization: `Bearer ${currentUser.token}`
					Authorization: `Bearer ${currentUser.token}`
				}
			});
		}

		return next.handle(request);
	}
}