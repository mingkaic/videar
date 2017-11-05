import { Http, Response, URLSearchParams } from '@angular/http'
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AudioModel } from '../../_models/audio.model';
import { AbstractAudioService } from './audioservice.abstract';

@Injectable()
export class ExposedAudioService extends AbstractAudioService {
	private exposedAudios: Map<string, AudioModel> = new Map;

	constructor(_sanitizer: DomSanitizer, _http: Http) {
		super(_sanitizer, _http);
		this.exposedUploads();
	};

	private exposedUploads (limit?: number) {
		let params = new URLSearchParams();
		this._http.get('/api/uploaded/' + String(limit || 10))
		.subscribe((data: Response) => {
			let metas = data.json();
			console.log('exposedUploads returned', metas);
			metas.forEach((meta) => this.getAudio(meta.id, meta.title));
		},
		(err) => { console.log(err); });
	};

	protected getAudioMap(): Map<string, AudioModel> {
		return this.exposedAudios;
	};
}
