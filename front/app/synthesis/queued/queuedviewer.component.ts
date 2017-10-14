import { Component, OnInit, SimpleChange } from '@angular/core';

import { Microservice } from '../../_models/mservice.model';
import { AudioModel } from '../../_models/audio.model';
import {
	SynthesisService,
	QueuedAudioService,
	MonitorService,
	WarningService
} from '../../_services';
import { AbstractViewerComponent } from '../../_utils/viewer.abstract';

const emptySub = {
	"id": "",
	"word": "<NO SUBTITLES PROCESSED>",
	"start": 0,
	"end": 0
}

class QueuedAudio extends AudioModel {
	s2tServiceUp: boolean = false;
	script: any[];
	list: any[] = [];
	chrono: any[] = [];
	limit: number = 20;
	chronoView: boolean = false;
	uncollapseScript: boolean = true;
	loadingScript: boolean = false;

	constructor(public model: AudioModel, 
				private _queuedService: QueuedAudioService,
				private _monitorService: MonitorService,
				private _warningService: WarningService) {
		super(model._id, model.name, model.ref);
		this.source = model.source;

		_monitorService.getHealthUpdateEmitter()
		.subscribe((services: Microservice[]) => {
			let s2tServ = services.find((service) => service.id === "s2t" );
			this.s2tServiceUp = s2tServ.status === "OK";
		});
	};

	getScript() {
		this.uncollapseScript = !this.uncollapseScript; // toggle
		if (!this.s2tServiceUp || this.script || this.loadingScript) {
			return;
		}
		// request script if local script is undefined
		this.script = [];
		this.loadingScript = true;
		this.updateSubtitles(this._queuedService.getSubtitles(this.model._id));
	};

	toggleChrono() {
		this.chronoView = !this.chronoView;
	};

	private updateSubtitles(audioCall) {
		this._monitorService.update();
		audioCall
		.subscribe((response) => {
			this.list = this.script = response;
			this.loadingScript = false;
			if (this.script.length === 0) {
				this.list = this.script = [emptySub];
			}
			this.setChronoview();
		},
		(err) => {
			console.log('subtitle error: ', err);
			// WARN ERROR
			this._warningService.warn(err);
			this.loadingScript = false;
			this.list = this.script = [emptySub];
			this.setChronoview();
		});
	};

	private setChronoview() {
		let words = new Set();
		this.chrono = [];
		for (let w of this.script) {
			if (!words.has(w.word)) {
				this.chrono.push(w);
			}
			words.add(w.word);
		}
	};
}

@Component({
	selector: 'app-queuedviewer',
	templateUrl: './queuedviewer.component.html',
	styleUrls: ['./queuedviewer.component.css', './loading.css']
})
export class QueuedViewerComponent extends AbstractViewerComponent implements OnInit {
	s2tServiceUp: boolean = false;
	synthesisScript: any[] = [];

	constructor(private _synthService: SynthesisService,
				private _queuedService: QueuedAudioService,
				private _monitorService: MonitorService,
				private _warningService: WarningService) {
		super(20, _queuedService);
		_monitorService.getHealthUpdateEmitter()
		.subscribe((services: Microservice[]) => {
			let s2tServ = services.find((service) => service.id === "s2t" );
			this.s2tServiceUp = s2tServ.status === "OK";
		});
	};

	ngOnInit() {
		this._queuedService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._queuedService));
	};
	
	trackByIndex(index: number, obj: any): any {
		return index;
	};

	onWordDrop(data: any) {
		this.synthesisScript.push(data.dragData);
	};

	removeScriptToken(index: number) {
		this.synthesisScript = this.synthesisScript.slice(index);
	};
	
	synthesize() {
		this._monitorService.update();
		if (this.s2tServiceUp) {
			this._synthService.synthesize(this.synthesisScript);
		}
	};

	protected wrapAudio(audio: AudioModel): AudioModel {
		return new QueuedAudio(audio, this._queuedService, 
			this._monitorService, this._warningService);
	};
}
