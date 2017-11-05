import { Http, Response } from '@angular/http'
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AudioModel } from '../../_models/audio.model';
import { AbstractAudioService } from './audioservice.abstract';

@Injectable()
export class PopularAudioService extends AbstractAudioService {
	private popularAudios: Map<string, AudioModel> = new Map;

	constructor(_sanitizer: DomSanitizer, _http: Http) {
		super(_sanitizer, _http);
		this.frontPage();
	};

	private frontPage () {
		this._http.get('/api/front_page')
		.subscribe((data: Response) => {
			let metas = data.json();
			console.log('frontPage returned', metas);
			metas.forEach((meta) => this.getAudio(meta.id, meta.title));
		},
		(err) => { console.log(err); });
	}

	protected getAudioMap(): Map<string, AudioModel> {
		return this.popularAudios;
	}
}
