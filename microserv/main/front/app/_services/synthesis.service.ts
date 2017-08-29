import { Http } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';

import * as ss from 'socket.io-stream';

import { AbstractSocketAudio } from '../_interfaces/socketaudio.abstract';

@Injectable()
export class SynthesisService extends AbstractSocketAudio {
	constructor(_sanitizer: DomSanitizer, private _http: Http) {
		super(_sanitizer);

		ss(this.socket).on('synthesized-audio', (synthId, synStream) => {
			console.log('streaming '+synthId);
			let soundData = [];
			synStream.on('data', (chunk) => {
				console.log('receiving synthchunk...');
				soundData.push(chunk);
			});
			synStream.on('end', () => {
				this.setAudioData(synthId, soundData);
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
		.subscribe((data) => {
			console.log('synthesis completed');
			var missing = data.json().missing;
			if (missing.length > 0) {
				console.log(missing);
			}
		});
	};
    
    protected getCallsign(id: string, source: string): string {
		return source;
	}
}
