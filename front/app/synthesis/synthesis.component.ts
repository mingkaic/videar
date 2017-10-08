import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';

import { AudioModel } from '../_models/audio.model';
import { QueuedAudioService, SynthesisService, WarningService } from '../_services';
import { AbstractViewerComponent } from '../_utils/viewer.abstract';

class SelectedAudio extends AudioModel {
	script: string;
	scriptComplete: boolean = false;
	uncollapseScript: boolean = true;
	scriptDisable: boolean = false;

	scriptProgress: number;

	constructor(model: AudioModel, 
				private _service: SynthesisService,
				private _warning: WarningService) { 
		super(model._id, model.name, model.ref);
		this.source = model.source;
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
	};
}

@Component({
	selector: 'app-synthesis',
	templateUrl: './synthesis.component.html',
	styleUrls: ['./synthesis.component.css'],
	providers: [ SynthesisService ]
})
export class SynthesisComponent extends AbstractViewerComponent implements OnInit {
	script: string;

	constructor(private _audioService: QueuedAudioService, 
				private _synthService: SynthesisService, 
				private _warningService: WarningService) {
		super(20, _audioService);
	};

	ngOnInit() {
		this._audioService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._audioService));
		this.script = "";
	};

	synthesize() {
		this._synthService.synthesize(this.script, []); // todo: implement
	};

	protected wrapAudio(audio: AudioModel): AudioModel {
		return new SelectedAudio(audio, this._synthService, this._warningService);
	};
}
