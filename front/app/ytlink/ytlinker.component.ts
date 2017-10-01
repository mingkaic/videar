import { Component, OnInit } from '@angular/core';

import { YoutubeAudioService } from '../_services/audioservices';

enum linkStatus {
	unprocessed = 0,
	processing,
	rejected
};

const linkString: string[] = ["unprocessed", "processing", "rejected"];
const utubeReg: RegExp = /^.*youtu(?:be\.com\/watch\?(?:.*&)*v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?.*/;

class YtLink {
	link: string = "";
	status: linkStatus = linkStatus.unprocessed;

	getStatus() {
		return linkString[this.status];
	}
}

@Component({
	selector: 'app-vidlinker',
	templateUrl: './ytlinker.component.html',
	styleUrls: ['../shared.css'],
})
export class YtLinkerComponent implements OnInit {
	links: YtLink[];

	constructor(private _audioService: YoutubeAudioService) {};

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
		let link = this.links[index];
		if (link.status === linkStatus.processing) {
			return;
		}
		link.status = linkStatus.processing;
		if (utubeReg.test(link.link)) {
			let vidId = utubeReg.exec(link.link)[1];
			this._audioService.getYoutube(vidId, 
			() => {
				this.removeLink(index);
			},
			() => {
				console.log('rejected from service');
				link.status = linkStatus.rejected;
			});
		}
		else {
			console.log(link.link);
			link.status = linkStatus.rejected;
		}
	};

	clearLink(index: number) {
		let link = this.links[index];
		link.link = "";
		link.status = linkStatus.unprocessed;
	};

	removeLink(index: number) {
		this.links.splice(index, 1);
		if (this.links.length === 0) {
			this.addLink();
		}
	};
};
