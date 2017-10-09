import { Component, OnInit, SimpleChange } from '@angular/core';

import { Microservice } from '../../_models/mservice.model';
import { AudioModel } from '../../_models/audio.model';
import {
	QueuedAudioService,
	MonitorService,
	WarningService
} from '../../_services';
import { AbstractViewerComponent } from '../../_utils/viewer.abstract';

class QueuedAudio extends AudioModel {
	s2tServiceUp: boolean = false;
	script: string;
	scriptComplete: boolean = false;
	uncollapseScript: boolean = true;
	scriptDisable: boolean = false;

	constructor(public model: AudioModel, 
				private _queuedService: QueuedAudioService,
				private _monitorService: MonitorService,
				private _warningService: WarningService) {
		super(model._id, model.name, model.ref);
		this.source = model.source;

		_monitorService.getHealthUpdateEmitter()
		.subscribe((services: Microservice[]) => {
			let s2tServ = services.find((service) => service.name === "s2t" );
			this.s2tServiceUp = s2tServ.status === "OK";
		});
	};

	getScript() {
		this.uncollapseScript = !this.uncollapseScript; // toggle
		if (this.script || this.scriptDisable) {
			return;
		}
		// request script if local script is undefined
		this.script = "";
		this.updateSubtitles(this._queuedService.getSubtitles(this.model._id));
	};

	private updateSubtitles(audioCall) {
		this._monitorService.update();
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
			this._warningService.warn(err);
		});
	};
}

@Component({
	selector: 'app-queuedviewer',
	templateUrl: './queuedviewer.component.html',
	styleUrls: ['./queuedviewer.component.css']
})
export class QueuedViewerComponent extends AbstractViewerComponent implements OnInit {
	constructor(private _queuedService: QueuedAudioService,
				private _monitorService: MonitorService,
				private _warningService: WarningService) {
		super(20, _queuedService);
	};

	ngOnInit() {
		this._queuedService.getAllKeys()
		.forEach(key => this.cacheUpdate(key, this._queuedService));
	};

	protected wrapAudio(audio: AudioModel): AudioModel {
		return new QueuedAudio(audio, this._queuedService, 
			this._monitorService, this._warningService);
	};
}
