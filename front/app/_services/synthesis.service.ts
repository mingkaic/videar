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
		// retrieve uploaded from local
		let synthIDs = localStorage.getItem('synthIDs');
		if (synthIDs) {
			JSON.parse(synthIDs).forEach((sid) => {
				this.getAudio(sid);
			});
		}
	};

	synthesize(script: any[]) {
		this._http.post('/api/synthesis', { "script": script })
		.subscribe((metadata: Response) => {
			let meta = metadata.json();
			this.getAudio(meta.id, meta.title);

			// save meta.id to local
			let synthIDs = localStorage.getItem('synthIDs');
			let sids = [];
			if (synthIDs) {
				sids = JSON.parse(synthIDs);
			}
			sids.push(meta.id);
			localStorage.setItem('synthIDs', JSON.stringify(sids));
		},
		(err) => {
			// WARN ERROR
			console.log(err);
			this._warning.warn(err);
		});
	};

	protected getAudioMap(): Map<string, AudioModel> {
		return this.popularAudios;
	}
}
