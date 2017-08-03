import { Component, OnInit } from '@angular/core';
import { VidLinkModel } from '../models/vidlink.model';
import { AudioHandleService } from '../services/audio.service';

@Component({
	selector: 'app-vidlinker',
	templateUrl: './vidlinker.component.html',
	styleUrls: ['./vidlinker.component.css']
})
export class VidlinkerComponent implements OnInit {
	links: VidLinkModel[];

	constructor(private _audioService: AudioHandleService) {};

	ngOnInit() {
		this.links = [ new VidLinkModel(this._audioService) ];
	};

	trackByIndex(index: number, obj: any): any {
		return index;
	};

	addLink() {
		this.links.push(new VidLinkModel(this._audioService));
	};

	removeLink(index: number) {
		if (index > 0 || this.links.length > 1) {
			this.links.splice(index, 1);
		}
		else if (index == 0) {
			this.links[0].clear();
		}
	};

	processLinks() {
		this.links.forEach((link: VidLinkModel, index: number) => {
			if (this._audioService.hasAudio(link.getId())) {
				this.removeLink(index);
			}
			else {
				link.processLink(() => {
					this.removeLink(index);
				});
			}
		});
	};
};
