import { Http } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';

import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

export class SynthParams {
	script: string;
	vidIds: string[];
}

@Injectable()
export class SynthesisService {
    synths: Map<string, SafeResourceUrl>;
    private synthSocket: io.Socket;

	constructor(private _sanitizer: DomSanitizer, private _http: Http) {
        this.synths = new Map;
        this.synthSocket = io();
		ss(this.synthSocket).on('synthesized-audio', (synthId, synStream) => {
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

	synthesize(param: SynthParams) {
		console.log(param);

		let uuid = UUID.UUID();
		this._http.put('/api/synthesize', { 
            "synthId": uuid, 
            "socketId": this.synthSocket.id, 
            "params": param 
        })
		.subscribe((data) => {
			console.log('synthesis completed');
			var missing = data.json().missing;
			if (missing.length > 0) {
				console.log(missing);
			}
		});
	};
    
    private setAudioData(id: string, soundData) {
		if (this.synths.has(id)) return;
		console.log('new synth Audio');

        let soundBlob = new Blob(soundData);
        let safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(soundBlob));
        this.synths.set(id, safeURL);
    };
}
