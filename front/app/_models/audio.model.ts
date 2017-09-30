import { SafeResourceUrl } from '@angular/platform-browser';

export class AudioModel {
	source: string;

	constructor(public _id: string, public name: string, public ref: SafeResourceUrl) {};

	getIconSrc(): string {
		let icon: string;
		switch(this.source) {
			case '.youtube':
				icon = "";
				break;
			case '.audiosearch':
				icon = "";
				break;
			case '.uploaded':
				icon = "";
				break;
		}
		return icon;
	};
}
