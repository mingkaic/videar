import { Component, Input, OnInit, SimpleChange } from '@angular/core';

import { AudioModel } from '../_models/audio.model';
import { AudioHandleService } from '../_services/audio.service';
import { AbstractViewerComponent, AudioWrapper } from '../_interfaces/viewer.abstract';
import { SimpleAudio } from '../simpleviewer/simpleviewer.component';

class DetailedAudio extends SimpleAudio {
	script: string;
	uncollapseScript: boolean = true;

	constructor(model: AudioModel, _audioService: AudioHandleService) { super(model, _audioService); }

	// go into detail
	getScript() {
		this.uncollapseScript = !this.uncollapseScript; // toggle
		if (this.script) {
			return;
		}
		// request script if local script is undefined
		this.script = "";
		this._audioService.requestSubtitles(this.model._id)
		.subscribe((response) => {
			var status = response.status;
			this.script = response.subtitle;
			if (this.script.length === 0) {
				this.script = "<NO SUBTITLES PROCESSED>"
			}
		});
	};
}

@Component({
	selector: 'app-audioviewer',
	templateUrl: './audioviewer.component.html',
	styleUrls: ['./audioviewer.component.css', '../shared.css']
})
export class AudioviewerComponent extends AbstractViewerComponent implements OnInit {
	constructor(private _audioService: AudioHandleService) {
		super(50, _audioService);
	};

	ngOnInit() {
		this._audioService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._audioService));
	};

	ngOnDestroy() {};
	
	protected wrapAudio(audio: AudioModel): AudioWrapper {
		return new DetailedAudio(audio, this._audioService);
	};
};
