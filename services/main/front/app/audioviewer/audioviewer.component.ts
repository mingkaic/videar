import { Component, OnInit } from '@angular/core';
import { AudioHandleService } from '../services/audio.service';

@Component({
	selector: 'app-audioviewer',
	templateUrl: './audioviewer.component.html',
	styleUrls: ['./audioviewer.component.css']
})
export class AudioviewerComponent implements OnInit {
	soundIds: string[];

	constructor(private _audioService: AudioHandleService)
	{
		this.soundIds = [];
	};

	ngOnInit() {
		this._audioService.setAdder(
		(vidId: string) => {
			if (vidId) {
				this.soundIds.push(vidId);
			}
		});
	};

	getAudioURL(vid: string) {
		return this._audioService.getLocalAudioUrl(vid);
	};
};
