import { Component, OnInit, SimpleChange } from '@angular/core';
import { AudioHandleService } from '../services/audio.service';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'audioviewer-component',
	templateUrl: './audioviewer.component.html',
	styleUrls: ['./audioviewer.component.css']
})
export class AudioviewerComponent implements OnInit {
	objectKeys = Object.keys;
	sounds: Map<string, SafeResourceUrl>;
	potSub: any;
	updateSub: any;

	constructor(private _audioService: AudioHandleService) {};

	ngOnInit() {
		this.sounds = this._audioService.sounds;

		this.potSub = this._audioService.potentialAudio
		.subscribe((newId: string) => {
			console.log('potential vid '+newId);
			this.sounds[newId] = null;
		});

		this.updateSub = this._audioService.newAudio
		.subscribe((newSPair: [string, SafeResourceUrl]) => {
			let newId = newSPair[0];
			console.log('new vid '+newId);
			delete this.sounds[newId];
			setTimeout(() => this.sounds[newId] = newSPair[1], 0);
		});
	};

	ngOnDestroy() {
		this.updateSub.unsubscribe();
		this.potSub.unsubscribe();
	}

	getAudioURL(vid: string) {
		return this._audioService.getAudioUrl(vid);
	};
};
