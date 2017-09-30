import { Http } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';

import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

import { AudioModel } from '../_models/audio.model';
import { WarningService } from './warning.service';
import { AbstractAudioService } from './audioservices/audioservice.abstract';

@Injectable()
export class SynthesisService extends AbstractAudioService {
	private socket: io.Socket = io();
	private popularAudios: Map<string, AudioModel> = new Map;

	constructor(_sanitizer: DomSanitizer, _http: Http, 
		private _warning: WarningService) {
		super(_sanitizer, _http);

		ss(this.socket).on('synthesized-audio', (synthId, synStream) => {
			console.log('streaming '+synthId);
			let soundData = [];
			synStream.on('data', (chunk) => {
				console.log('receiving synthchunk...');
				soundData.push(chunk);
			});
			synStream.on('end', () => {
				this.setAudioForm(synthId, synthId, new Blob(soundData));
			});
		});
	};

	synthesize(script: String, vidIds: string[]) {
		let uuid = UUID.UUID();
		this._http.put('/api/synthesize', { 
			"synthId": uuid, 
			"socketId": this.socket.id, 
			"params": { "script": script, "vidIds": vidIds } 
		})
		.timeout(100000)
		.subscribe((data) => {
			console.log('synthesis completed');
			var missing = data.json().missing;
			if (missing.length > 0) {
				console.log(missing);
				// WARN MISSING
				this._warning.warn("missing tokens: " + missing);
			}
		},
		(err) => {
			console.log('SYNTHESIS: ', err);
			// WARN ERROR
			this._warning.warn(err);
		});
	};
	
	protected getAudioMap(): Map<string, AudioModel> {
		return this.popularAudios;
	}
}
