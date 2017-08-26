import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../_services';

// taken from http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
@Component({
	selector: 'app-register',
	templateUrl: 'register.component.html',
	styleUrls: ['./register.component.css'],
	providers: [ UserService ]
})
export class RegisterComponent {
	model: any = {};

	loading = false;

	constructor(private router: Router, private regService: UserService) {};

	register() {
		this.loading = true;
		this.regService.create(this.model)
		.subscribe(
		(data) => {
			console.log('Registration successful');
			this.router.navigate(['/login']);
		},
		(err) => {
			console.log(err);
			this.loading = false;
		});
	};
}
