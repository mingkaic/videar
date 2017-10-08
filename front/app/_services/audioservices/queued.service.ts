import { Http, Response, ResponseContentType } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';

import 'rxjs/add/operator/timeout';

import { AudioModel } from '../../_models/audio.model';
import { AbstractAudioService } from './audioservice.abstract';

@Injectable()
export class QueuedAudioService extends AbstractAudioService {
	private queuedAudios: Map<string, AudioModel> = new Map;

	constructor(_sanitizer: DomSanitizer, _http: Http) {
		super(_sanitizer, _http);

		// retrieve queued from cookie
		let selectedIDs = localStorage.getItem('selectedIDs');
		if (selectedIDs) {
			JSON.parse(selectedIDs).forEach((sid) => {
				this.getAudio(sid);
			});
		}
	};

	getSubtitles(vidId: string) {
		return this._http.get('/api/audio_subtitles/' + vidId)
		.map((data: Response) => {
			return data.json();
		});
	};

	processSubtitles(vidId: string) {
		// return this._http.post('/api/audio_subtitles/' + vidId, 
		// { "reqId":  UUID.UUID() })
		// .timeout(100000)
		// .map((data: Response) => {
		// 	return data.json();
		// });
	}

	protected getAudioMap(): Map<string, AudioModel> {
		return this.queuedAudios;
	}
}
