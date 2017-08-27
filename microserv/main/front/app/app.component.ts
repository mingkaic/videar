import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Videar';
	storage = {
		
	};

	constructor(private router: Router) {};

	getUser() {
		let userInfo = localStorage.getItem('currentUser');
		if (userInfo) {
			return JSON.parse(userInfo).name;
		}
		return "";
	};

	hasUser() {
		console.log("EYYY ", null !== localStorage.getItem('currentUser'));
		return null !== localStorage.getItem('currentUser');
	};
};
