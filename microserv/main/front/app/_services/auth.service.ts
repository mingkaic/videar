import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

// taken from http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
@Injectable()
export class AuthenticationService {
	constructor(private _http: Http) {};
	
	login(username: string, password: string) {
		return this._http.post('/api/authenticate', { "username": username, "password": password })
		.map((data) => {
			// login successful if there's a jwt token in the response
			let user = data.json();
			if (user.err) {
				console.log(user.err);
			}
			else if (user && user.id) {
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				localStorage.setItem('currentUser', JSON.stringify(user));
			}
		});
	};

	logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
	};
}
