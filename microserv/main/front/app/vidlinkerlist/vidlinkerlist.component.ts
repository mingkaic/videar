import { Component, OnInit } from '@angular/core';
import { VidLinkModel } from '../models/vidlink.model';
import { AudioHandleService } from '../services/audio.service';
import { VidLinkerComponent } from '../vidlinker/vidlinker.component';

@Component({
	selector: 'app-vidlinkerlist',
	templateUrl: './vidlinkerlist.component.html',
	styleUrls: ['./vidlinkerlist.component.css'],
	directives: [VidLinkerComponent]
})
export class VidLinkerListComponent implements OnInit {
	links: string[];

	constructor(private _audioService: AudioHandleService) {};

	ngOnInit() {
		this.links = [ new VidLinkModel(this._audioService) ];
	};

	trackByIndex(index: number, obj: any): any {
		return index;
	};

	addLink() {
		this.links.push("");
	};

	removeComponent(index: number) {
		this.links.splice(index, 1);
		if (this.links.length === 0) {
			addLink();
		}
	};
};
