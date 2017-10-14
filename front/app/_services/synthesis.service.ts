import { Http } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AudioModel } from '../_models/audio.model';
import { WarningService } from './warning.service';
import { AbstractAudioService } from './audioservices/audioservice.abstract';

@Injectable()
export class SynthesisService extends AbstractAudioService {
	private popularAudios: Map<string, AudioModel> = new Map;

	constructor(_sanitizer: DomSanitizer, _http: Http, 
		private _warning: WarningService) {
		super(_sanitizer, _http);
	};

	synthesize(script: any[]) {
		// let uuid = UUID.UUID();
		// this._http.put('/api/synthesize', { 
		// 	"synthId": uuid, 
		// 	"params": { "script": script, "vidIds": vidIds } 
		// })
		// .timeout(100000)
		// .subscribe((data) => {
		// 	console.log('synthesis completed');
		// 	var missing = data.json().missing;
		// 	if (missing.length > 0) {
		// 		console.log(missing);
		// 		// WARN MISSING
		// 		this._warning.warn("missing tokens: " + missing);
		// 	}
		// },
		// (err) => {
		// 	console.log('SYNTHESIS: ', err);
		// 	// WARN ERROR
		// 	this._warning.warn(err);
		// });
	};

	protected getAudioMap(): Map<string, AudioModel> {
		return this.popularAudios;
	}
}
