import { Component, Input, OnInit, SimpleChange } from '@angular/core';

import { AudioModel } from '../_models/audio.model';
import { AudioHandleService } from '../_services/audio.service';
import { AbstractViewerComponent, AudioWrapper } from '../_interfaces/viewer.abstract';

export class SimpleAudio extends AudioWrapper {
	private edit = false;

	constructor(public model: AudioModel) { super(model); }

	getEdit() {
		return this.edit;
	}

	toggleEdit() {
		if (this.edit) {
			// update model
		}
		this.edit = !this.edit;
	}
};

@Component({
	selector: 'app-simpleviewer',
	templateUrl: './simpleviewer.component.html',
	styleUrls: ['./simpleviewer.component.css']
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
		return new SimpleAudio(audio);
	};
};
