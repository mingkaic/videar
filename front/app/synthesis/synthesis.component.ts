import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';

import { AudioModel } from '../_models/audio.model';
import { Microservice } from '../_models/mservice.model';
import {
	SynthesisService, 
	WarningService, 
	MonitorService
} from '../_services';
import { AbstractViewerComponent } from '../_utils/viewer.abstract';

@Component({
	selector: 'app-synthesis',
	templateUrl: './synthesis.component.html',
	styleUrls: ['./synthesis.component.css'],
	providers: [ SynthesisService ]
})
export class SynthesisComponent implements OnInit {
	s2tServiceUp: boolean = false;
	script: string;

	constructor(private _synthService: SynthesisService,
				private _monitorService: MonitorService,
				private _warningService: WarningService) {
		_monitorService.getHealthUpdateEmitter()
		.subscribe((services: Microservice[]) => {
			let s2tServ = services.find((service) => service.id === "s2t" );
			this.s2tServiceUp = s2tServ.status === "OK";
		});
	};

	ngOnInit() {};

	synthesize() {
		this._monitorService.update();
		this._synthService.synthesize(this.script, []); // todo: implement
	};
}
