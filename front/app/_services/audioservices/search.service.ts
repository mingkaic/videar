import { Http, Response, ResponseContentType } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AudioModel } from '../../_models/audio.model';
import { AbstractAudioService } from './audioservice.abstract';

@Injectable()
export class SearchAudioService extends AbstractAudioService {
	private popularAudios: Map<string, AudioModel> = new Map;

	constructor(_sanitizer: DomSanitizer, _http: Http) {
		super(_sanitizer, _http);
	};

	// move to query audio serive
	search (keyword: string) {
		this._http.post('/api/search', { "word": keyword })
		.subscribe((data: Response) => {
			data.json().ids.forEach((id) => this.getAudio(id));
		},
		(err) => { console.log(err); });
	};

	protected getAudioMap(): Map<string, AudioModel> {
		return this.popularAudios;
	}
}
