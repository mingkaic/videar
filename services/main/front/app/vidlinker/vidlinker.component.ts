import { Component, OnInit } from '@angular/core';
import { VidLinkModel } from '../models/vidlink.model';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';


import * as ss from 'socket.io-stream';

@Component({
	selector: 'app-vidlinker',
	templateUrl: './vidlinker.component.html',
	styleUrls: ['./vidlinker.component.css']
})
export class VidlinkerComponent implements OnInit {
	links: VidLinkModel[];

	soundIds: string[];
	private sounds: Map<string, string>;

	constructor(private _sanitizer: DomSanitizer) {
		this.soundIds = [];
		this.sounds = new Map<string, string>();
	};

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
		else if (index == 0) {
			this.links[index].clear();
		}
	};

	processLinks() {
		this.links.forEach((link: VidLinkModel, index: number) => {
			// check if link is already in soundId
			link.processLink()
			.then((audioSocket) => {
				if (audioSocket) {
					ss(audioSocket).on('audio-stream', (stream, vidId: string) => {
						let soundData = [];
						stream.on('data', (chunk) => {
							soundData.push(chunk);
						});
						stream.on('end', () => {
							this.removeLink(index);
							this.soundIds.push(vidId);
							let soundBlob = new Blob(soundData);
							this.sounds[vidId] = URL.createObjectURL(soundBlob);
						});
					});
				}
			});
		});
	};

	getAudioURL(vid: string) {
		return this._sanitizer.bypassSecurityTrustResourceUrl(this.sounds[vid]);
	}
};
