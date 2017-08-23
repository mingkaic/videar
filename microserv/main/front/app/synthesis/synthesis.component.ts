import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';

import { AudioHandleService } from '../services/audio.service';

import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

class SynthParams {
	script: string;
	vidIds: string[];
}

@Component({
	selector: 'app-synthesis',
	templateUrl: './synthesis.component.html',
	styleUrls: ['./synthesis.component.css']
})
export class SynthesisComponent implements OnInit {
	param: SynthParams;

	constructor(private _audioService: AudioHandleService, private _http: Http) {
		this.param = new SynthParams;
	};

	ngOnInit() {
		this.param.script = "";
	};

	synthesize() {
		this.param.vidIds = this._audioService.getSelectedIds();
		// todo: move to service
		let socket = io();

		let uuid = UUID.UUID();
		console.log(this.param);
		this._http.put('/api/synthesize', { "synthId": uuid, "socketId": socket.id, "params": this.param })
		.subscribe((data) => {
			console.log(data.json());
		})
		ss(socket).on('synthesized-audio', (synStream) => {
			// do something with stream
		});
	};
}
