import { Http, Response, ResponseContentType } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';

import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

import 'rxjs/add/operator/timeout';

import { AudioModel } from '../../_models/audio.model';
import { AbstractAudioService } from './audioservice.abstract';

@Injectable()
export class UploadAudioService extends AbstractAudioService {
	private socket: io.Socket = io();
	private uploadedAudios: Map<string, AudioModel> = new Map;

	constructor(_sanitizer: DomSanitizer, _http: Http) {
		super(_sanitizer, _http);
	};

	// move to user audio service
	updateTitle(audio: AudioModel) {
		this._http.post('/api/audio_meta/' + audio._id, { 'name': audio.name })
		.subscribe((data: Response) => {
			console.log(audio._id + " update successful");
		},
		(err) => {
			console.log(err);
		});
	};

	sendAudio(file: File, onSuccess?: (() => void)) {
		var outStream = ss.createStream();
		ss(this.socket).emit('post-audio-client', outStream, file.name);
		ss.createBlobReadStream(file).pipe(outStream);
		outStream.on('finish', () => {
			onSuccess();
		});
	};

	protected getAudioMap(): Map<string, AudioModel> {
		return this.uploadedAudios;
	}
}
