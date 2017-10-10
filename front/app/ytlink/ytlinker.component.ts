import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';

import { Microservice } from '../_models/mservice.model';
import { YoutubeAudioService, MonitorService } from '../_services';

enum linkStatus {
	unprocessed = 0,
	processing,
	rejected
};

const linkString: string[] = ["unprocessed", "processing", "rejected"];
const utubeReg: RegExp = /^.*youtu(?:be\.com\/watch\?(?:.*&)*v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?.*/;

export class YtLink {
	id: string = UUID.UUID();
	link: string = "";
	status: linkStatus = linkStatus.unprocessed;

	getStatus() {
		return linkString[this.status];
	};
}

@Component({
	selector: 'app-vidlinker',
	templateUrl: './ytlinker.component.html',
	styleUrls: ['./ytlinker.component.css'],
	providers: [ YoutubeAudioService ]
})
export class YtLinkerComponent implements OnInit {
	uasServiceUp: boolean = false;
	links: YtLink[];

	constructor(private _audioService: YoutubeAudioService,
				private _monitorService: MonitorService) {
		_monitorService.getHealthUpdateEmitter()
		.subscribe((services: Microservice[]) => {
			let uasServ = services.find((service) => service.id === "uas" );
			this.uasServiceUp = uasServ.status === "OK";
		});
	};

	ngOnInit() {
		this.links = [ new YtLink() ];
	};

	trackByIndex(index: number, obj: any): any {
		return index;
	};

	addLink() {
		this.links.push(new YtLink());
	};

	processLink(index: number) {
		this._monitorService.update();
		let link = this.links[index];
		if (link.status === linkStatus.processing) {
			return;
		}
		link.status = linkStatus.processing;
		if (utubeReg.test(link.link)) {
			let vidId = utubeReg.exec(link.link)[1];
			this._audioService.getYoutube(vidId,
			() => {
				this.removeLink(link.id);
			},
			() => {
				link.status = linkStatus.rejected;
			});
		}
		else {
			link.status = linkStatus.rejected;
		}
	};

	clearLink(index: number) {
		let link = this.links[index];
		link.link = "";
		link.status = linkStatus.unprocessed;
	};

	removeLink(id: string) {
		let index = this.links.indexOf(
			this.links.find((link) => link.id === id));
		this.links.splice(index, 1);
		if (this.links.length === 0) {
			this.addLink();
		}
	};
}
