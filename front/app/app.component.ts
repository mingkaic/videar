import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NguiPopupComponent, NguiMessagePopupComponent } from '@ngui/popup';

import { AuthenticationService } from './_services/auth.service';
import { WarningService } from './_services/warning.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css', './shared.css'],
	providers: [ AuthenticationService ]
})
export class AppComponent {
	@ViewChild(NguiPopupComponent) popup: NguiPopupComponent;
	
	title = 'Videar';

	constructor(private router: Router, 
		private authenticationService: AuthenticationService,
		warningService: WarningService) {
		warningService.getWarningEmitter().subscribe((message) => {
			this.popup.open(NguiMessagePopupComponent, {
				"title": 'WARNING',
				"message": message
			});
		});
	};

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
