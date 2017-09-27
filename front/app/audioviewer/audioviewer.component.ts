import { Component, Input, OnInit, SimpleChange } from '@angular/core';

import * as io from 'socket.io-client';

import { AudioModel } from '../_models/audio.model';
import { AudioHandleService, WarningService } from '../_services';
import { AbstractViewerComponent, AudioWrapper } from '../_interfaces/viewer.abstract';
import { SimpleAudio } from '../simpleviewer/simpleviewer.component';

class DetailedAudio extends SimpleAudio {
	script: string;
	scriptComplete: boolean = false;
	uncollapseScript: boolean = true;
	scriptDisable: boolean = false;

	scriptProgress: number;

	constructor(model: AudioModel, _audioService: AudioHandleService,
		private _warning: WarningService) { super(model, _audioService); }

	// go into detail
	getScript() {
		this.uncollapseScript = !this.uncollapseScript; // toggle
		if (this.script || this.scriptDisable) {
			return;
		}
		// request script if local script is undefined
		this.script = "";
		this.updateSubtitles(this._audioService.getSubtitles(this.model._id));
	};

	processSubtitles() {
		this.scriptDisable = true;
		this.scriptProgress = 0; 
		console.log('processing subtitles');
		let progressSocket = io();
		progressSocket.on('progress', (completion) => {
			this.scriptProgress = completion;
		});
		this.updateSubtitles(this._audioService.processSubtitles(this.model._id, progressSocket));
	};

	private updateSubtitles(audioCall) {
		audioCall
		.subscribe((response) => {
			let status = response.status;
			this.script = response.subtitle;
			if (this.script.length === 0) {
				this.script = "<NO SUBTITLES PROCESSED>"
			}
			this.scriptComplete = status === "complete";
			this.scriptDisable = false;
		},
		(err) => {
			console.log('SYNTHESIS: ', err);
			// WARN ERROR
			this._warning.warn(err);
		});
	}
}

@Component({
	selector: 'app-audioviewer',
	templateUrl: './audioviewer.component.html',
	styleUrls: ['./audioviewer.component.css', '../shared.css']
})
export class AudioViewerComponent extends AbstractViewerComponent implements OnInit {
	constructor(private _audioService: AudioHandleService, private _warningService: WarningService) {
		super(50, _audioService);
	};

	ngOnInit() {
		this._audioService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._audioService));

		this._audioService.frontPage();
	};

	ngOnDestroy() {};
	
	protected wrapAudio(audio: AudioModel): AudioWrapper {
		return new DetailedAudio(audio, this._audioService, this._warningService);
	};
};
