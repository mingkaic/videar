import { Http, Response, ResponseContentType } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';

import { Socket } from 'socket.io-client';
import * as ss from 'socket.io-stream';
import 'rxjs/add/operator/timeout';

import { AudioModel } from '../../_models/audio.model';
import { AbstractAudioService } from './audioservice.abstract';

@Injectable()
export class QueuedAudioService extends AbstractAudioService {
	private queuedAudios: Map<string, AudioModel> = new Map;

	constructor(_sanitizer: DomSanitizer, _http: Http) {
		super(_sanitizer, _http);
	};

	getSubtitles(vidId: string) {
		return this._http.get('/api/audio_subtitles/' + vidId)
		.map((data: Response) => {
			return data.json();
		});
	};

	processSubtitles(vidId: string, progressSocket: Socket) {
		return this._http.post('/api/audio_subtitles/' + vidId, 
		{ "reqId":  UUID.UUID(), "socketId": progressSocket.id })
		.timeout(100000)
		.map((data: Response) => {
			return data.json();
		});
	}

	protected getAudioMap(): Map<string, AudioModel> {
		return this.queuedAudios;
	}
}
