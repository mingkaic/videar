import { Component, OnInit, SimpleChange } from '@angular/core';

import { AudioModel } from '../../_models/audio.model';
import { SynthesisService } from '../../_services/synthesis.service';
import { AbstractViewerComponent, AudioWrapper } from '../../_interfaces/viewer.abstract';

class SynthAudio extends AudioWrapper {
	script: string;
	synthProgress: number = 0;

	constructor(public model: AudioModel) { super(model); }
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
	
	protected wrapAudio(audio: AudioModel): AudioWrapper {
		return new SynthAudio(audio);
	};
};
