import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';

import { AudioHandleService, SynthParams, SynthesisService } from '../_services';

import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

@Component({
	selector: 'app-synthesis',
	templateUrl: './synthesis.component.html',
	styleUrls: ['./synthesis.component.css'],
	providers: [ SynthesisService ]
})
export class SynthesisComponent implements OnInit {
	param: SynthParams;

	constructor(private _audioService: AudioHandleService, 
		private _synthService: SynthesisService) {
		this.param = new SynthParams;
	};

	ngOnInit() {
		this.param.script = "";
	};

	synthesize() {
		this.param.vidIds = this._audioService.getSelectedIds();
		this._synthService.synthesize(this.param);
	};
}
