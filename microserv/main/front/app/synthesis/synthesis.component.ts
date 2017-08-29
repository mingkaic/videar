import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';

import * as ss from 'socket.io-stream';

import { AudioModel } from '../_models/audio.model';
import { AudioHandleService, SynthesisService } from '../_services';
import { AbstractViewerComponent, AudioWrapper } from '../_interfaces/viewer.abstract';

class SelectedAudio extends AudioWrapper {
	selected: boolean = false;

	constructor(public model: AudioModel) { super(model); };
	
	toggleSelect() {
		this.selected = !this.selected;
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

	constructor(private _audioService: AudioHandleService, private _synthService: SynthesisService) {
		super(20, _audioService);
	};

	ngOnInit() {
		this._audioService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._audioService));
		this.script = "";
	};
	
	ngOnDestroy() {};

	synthesize() {
		this._synthService.synthesize(this.script, this.getSelected());
	};
	
	protected wrapAudio(audio: AudioModel): AudioWrapper {
		return new SelectedAudio(audio);
	};
	
	private getSelected(): string[] {
		return this.cache.toArray()
		.filter((audio: SelectedAudio) => audio.selected)
		.map((audio: AudioWrapper) => audio.model._id);
	};
}
