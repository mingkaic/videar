import { Component, Input, OnInit, SimpleChange } from '@angular/core';

import { AudioModel } from '../_models/audio.model';
import { AudioHandleService } from '../_services/audio.service';
import { AbstractViewerComponent, AudioWrapper } from '../_interfaces/viewer.abstract';
import { SimpleAudio } from '../simpleviewer/simpleviewer.component';

class DetailedAudio extends SimpleAudio {
	constructor(public model: AudioModel) { super(model); }

	// go into detail
}

@Component({
	selector: 'app-audioviewer',
	templateUrl: './audioviewer.component.html',
	styleUrls: ['./audioviewer.component.css']
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
		return new DetailedAudio(audio);
	};
};
