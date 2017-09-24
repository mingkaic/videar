import { Component, Input, OnInit, SimpleChange } from '@angular/core';

import { AudioModel } from '../_models/audio.model';
import { AudioHandleService } from '../_services/audio.service';
import { AbstractViewerComponent, AudioWrapper } from '../_interfaces/viewer.abstract';

export class SimpleAudio extends AudioWrapper {
	private edit = false;
	private edited = false;

	constructor(public model: AudioModel, 
		protected _audioService: AudioHandleService) { super(model); };

	changed() { this.edited = true; }

	getEdit() {
		return this.edit;
	};

	toggleEdit() {
		if (this.edit && this.edited) {
			// update model
			this._audioService.updateAudio(this.model);
		}
		this.edit = !this.edit;
		this.edited = false;
	};
};

@Component({
	selector: 'app-simpleviewer',
	templateUrl: './simpleviewer.component.html',
	styleUrls: ['./simpleviewer.component.css', '../shared.css']
})
export class SimpleViewerComponent extends AbstractViewerComponent implements OnInit {
	constructor(private _audioService: AudioHandleService) {
		super(20, _audioService);
	};
	
	ngOnInit() {
		this._audioService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._audioService));
	};

	ngOnDestroy() {};

	protected wrapAudio(audio: AudioModel): AudioWrapper {
		return new SimpleAudio(audio, this._audioService);
	};
};
