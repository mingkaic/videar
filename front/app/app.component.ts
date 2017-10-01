import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NguiPopupComponent, NguiMessagePopupComponent } from '@ngui/popup';

import { AbstractViewerComponent } from './_interfaces/viewer.abstract';
import { Microservice } from './_models/mservice.model';
import {
	AuthenticationService,
	ModalService,
	QueuedAudioService,
	WarningService
} from './_services';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css', './shared.css'],
	providers: [ AuthenticationService, ModalService ]
})
export class AppComponent extends AbstractViewerComponent implements OnInit {
	@ViewChild(NguiPopupComponent) popup: NguiPopupComponent;

	title = 'Videar';
	private bodyText: string;
	private services: Microservice[];

	constructor(private router: Router, 
		private modalService: ModalService,
		private _authService: AuthenticationService,
		private _queuedService: QueuedAudioService,
		warningService: WarningService) {
		super(20, _queuedService);
		warningService.getWarningEmitter().subscribe((message) => {
			this.popup.open(NguiMessagePopupComponent, {
				"title": 'WARNING',
				"message": message
			});
		});
		this.services = new Array();
	};

	ngOnInit() {
		this.bodyText = 'This text can be updated in modal 1';
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
		this._authService.logout();
	};

	openModal(id: string){
		this.modalService.open(id);
	};

	closeModal(id: string){
		this.modalService.close(id);
	};
};
