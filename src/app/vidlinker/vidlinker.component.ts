import { Component, OnInit } from '@angular/core';
import { VidLinkModel } from './vidlink.model';

@Component({
	selector: 'app-vidlinker',
	templateUrl: './vidlinker.component.html',
	styleUrls: ['./vidlinker.component.css']
})
export class VidlinkerComponent implements OnInit {
	links: VidLinkModel[];

	constructor() {};

	ngOnInit() {
		this.links = [new VidLinkModel()];
	};

	trackByIndex(index: number, obj: any): any {
		return index;
	};

	addLink() {
		this.links.push(new VidLinkModel());
	};

	removeLink(index: number) {
		if (index > 0 || this.links.length > 1) {
			this.links.splice(index, 1);
		}
	};

	processLinks() {
		this.links.forEach(element => {
			element.processLink();
		});
	};
};
