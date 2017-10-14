import { Http, Response, ResponseContentType } from '@angular/http'
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
		this._http.post('/api/synthesis', { "script": script })
		.subscribe((metadata: Response) => {
			let meta = metadata.json();
			this._http.get('/api/audio/' + meta.id,
			{ "responseType": ResponseContentType.ArrayBuffer })
			.subscribe((data: Response) => {
				let audio = new Blob([data.arrayBuffer()], { type: "application/octet-stream" });
				this.setAudioForm(meta.id, meta.title, audio);
			});
		},
		(err) => {
			console.log('SYNTHESIS ERROR: ', err);
			// WARN ERROR
			this._warning.warn(err);
		});
	};

	protected getAudioMap(): Map<string, AudioModel> {
		return this.popularAudios;
	}
}
