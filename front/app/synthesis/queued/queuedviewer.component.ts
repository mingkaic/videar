import { Component, OnInit, SimpleChange } from '@angular/core';

import { QueuedAudioService } from '../../_services';
import { AudioModel } from '../../_models/audio.model';
import { AbstractViewerComponent } from '../../_interfaces/viewer.abstract';

class SynthAudio extends AudioModel {
	script: string;
	synthProgress: number = 0;

	constructor(public model: AudioModel) {
		super(model._id, model.name, model.ref);
		this.source = model.source;
	};
};

@Component({
	selector: 'app-queuedviewer',
	templateUrl: './queuedviewer.component.html',
	styleUrls: ['./queuedviewer.component.css', '../../shared.css']
})
export class QueuedViewerComponent extends AbstractViewerComponent implements OnInit {
	constructor(private _synthService: QueuedAudioService) {
		super(20, _synthService);
	};
	
	ngOnInit() {
		this._synthService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._synthService));
	};
	
	ngOnDestroy() {};
	
	protected wrapAudio(audio: AudioModel): AudioModel {
		return new SynthAudio(audio);
	};
};
