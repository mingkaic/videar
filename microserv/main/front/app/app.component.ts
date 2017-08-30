import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css', './shared.css'],
	providers: [ AuthenticationService ]
})
export class AppComponent {
	title = 'Videar';
	storage = {
		
	};

	constructor(private router: Router, private authenticationService: AuthenticationService) {};

	getUser() {
		let userInfo = localStorage.getItem('currentUser');
		if (userInfo) {
			return JSON.parse(userInfo).name;
		}
		return "";
	};

	hasUser() {
		return null !== localStorage.getItem('currentUser');
	};

	logout() {
		this.authenticationService.logout();
	};
};
