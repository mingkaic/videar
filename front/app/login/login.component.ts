import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../_services/auth.service';

// taken from http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
@Component({
	selector: 'app-login',
	templateUrl: 'login.component.html',
	styleUrls: ['./login.component.css'],
	providers: [ AuthenticationService ]
})
export class LoginComponent implements OnInit {
	username: string;
	password: string;
	loading = false;

	private returnUrl: string;

	constructor(private route: ActivatedRoute,
		private router: Router, 
		private authenticationService: AuthenticationService) {};

	ngOnInit() {
		// reset login status
		this.authenticationService.logout();

		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	};

	login() {
		this.loading = true;
		this.authenticationService.login(this.username, this.password)
		.subscribe(
		(data) => {
			this.router.navigate([this.returnUrl]);
		},
		(err) => {
			console.log(err);
			this.loading = false;
		});
	};
}
