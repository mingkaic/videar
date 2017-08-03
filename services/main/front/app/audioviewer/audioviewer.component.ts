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
		this._audioService.setAdder(
		(vidId: string) => {
			if (vidId) {
				this.soundIds.push(vidId);
			}
		});
	};

	ngOnInit() {};

	getAudioURL(vid: string) {
		return this._audioService.getLocalAudioUrl(vid);
	};
};
