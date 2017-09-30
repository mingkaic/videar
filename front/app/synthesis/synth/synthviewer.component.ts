import { Component, OnInit, SimpleChange } from '@angular/core';

import { AudioModel } from '../../_models/audio.model';
import { SynthesisService } from '../../_services/synthesis.service';
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
	selector: 'app-synthviewer',
	templateUrl: './synthviewer.component.html',
	styleUrls: ['./synthviewer.component.css', '../../shared.css']
})
export class SynthViewerComponent extends AbstractViewerComponent implements OnInit {
	constructor(private _synthService: SynthesisService) {
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
