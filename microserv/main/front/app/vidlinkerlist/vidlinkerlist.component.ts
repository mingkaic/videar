import { Component, OnInit } from '@angular/core';
import { AudioHandleService } from '../services/audio.service';

@Component({
	selector: 'app-vidlinkerlist',
	templateUrl: './vidlinkerlist.component.html',
	styleUrls: ['./vidlinkerlist.component.css']
})
export class VidLinkerListComponent implements OnInit {
	links: string[];

	constructor(private _audioService: AudioHandleService) {};

	ngOnInit() {
		this.links = [ "" ];
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
			this.addLink();
		}
	};
};
