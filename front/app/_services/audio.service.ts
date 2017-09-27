import { Http, Response, ResponseContentType } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';

import { Socket } from 'socket.io-client';
import * as ss from 'socket.io-stream';
import 'rxjs/add/operator/timeout';

import { AudioModel } from '../_models/audio.model';
import { AbstractSocketAudio } from '../_interfaces/socketaudio.abstract';

@Injectable()
export class AudioHandleService extends AbstractSocketAudio {
	constructor(_sanitizer: DomSanitizer, 
		private _http: Http) {
		super(_sanitizer);
		this.frontPage();

		// socket listeners
		this.socket.on('new-audio', (id: string) => {
			console.log('new audio notified '+id);
			// todo: implement selective audio loading before requesting audio (not every audio needs to be viewed)
			// IF logged in load user's audios first

			// audio streaming is expensive
			this.requestAudio(id);
		});

		ss(this.socket).on('audio-stream',
		(stream, vidId: string) => {
			console.log('streaming '+vidId);
			let soundData = [];
			stream.on('data', (chunk) => {
				soundData.push(chunk);
			});
			stream.on('end', () => {
				this.setAudioData(vidId, new Blob(soundData));
			});
		});
	};
	
	updateAudio(audio: AudioModel) {
		this._http.post('/api/audio_meta/' + audio._id, { 'name': audio.name })
		.subscribe((data: Response) => {
			console.log(audio._id + " update successful");
		},
		(err) => {
			console.log(err);
		});
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

	sendAudio(file: File, onSuccess?: (() => void)) {
		var outStream = ss.createStream();
		ss(this.socket).emit('post-audio-client', outStream, file.name);
		ss.createBlobReadStream(file).pipe(outStream);
		outStream.on('finish', () => {
			onSuccess();
		})
	};

	requestAudio(vidId: string) {
		if (this.hasAudioModel(vidId) && null != this.getAudioModel(vidId).ref) return;
		console.log('requesting stream for '+vidId);
		this._http.post('/api/req_audio', { "socketId": this.socket.id, "vidId": vidId })
		.subscribe((data: Response) => {
			console.log("REQUESTED AUDIO ", data.json());
			var name = data.json().name;
			if (name) {
				this.setName(vidId, name);
			}
			else {
				console.log("notified of new id, but can't find video of id " + vidId);
			}
		},
		(err) => { console.log(err); });
	};



	frontPage () {
		this._http.get('/api/front_page')
		.subscribe((data: Response) => {
			data.json().ids.forEach((id) => this.getAudio(id));
		},
		(err) => { console.log(err); });
	}

	search (keyword: string) {
		this._http.post('/api/search', { "word": keyword })
		.subscribe((data: Response) => {
			data.json().ids.forEach((id) => this.getAudio(id));
		},
		(err) => { console.log(err); });
	};

	getYoutube (youtubeId: string, onSuccess?: (() => void), onFail?: (() => void)) {
		if (this.hasAudioModel(youtubeId)) return;
		console.log('verifying id existence');
		this._http.post('/api/youtube', { "id": youtubeId })
		.subscribe((data: Response) => {
			this.metadata(youtubeId)
			.subscribe((meta) => {
				let audio = new Blob([data], { type: "application/octet-stream" });
				this.setAudioForm(youtubeId, meta.title, audio);
				if (onSuccess) {
					onSuccess();
				}
			},
			(err) => {
				console.log(err);
				if (onFail) {
					onFail();
				}
			});
		},
		(err) => {
			console.log(err);
			if (onFail) {
				onFail();
			}
		});
	};

	private metadata (id: string) {
		return this._http.get('/api/audio_meta/' + id).map((data: Response) => data.json());
	};

	private getAudio (id: string, title?: string) {
		if (!title) {
			this.metadata(id)
			.subscribe((meta) => {
				this.getAudio(id, meta.title);
			},
			(err) => { console.log(err); });
		}
		else {
			this._http.get('/api/audio/' + id, 
			{ "responseType": ResponseContentType.ArrayBuffer })
			.subscribe((res) => {
				let audio = new Blob([res.arrayBuffer()], { type: "application/octet-stream" });
				this.setAudioForm(id, title, audio);
			},
			(err) => { console.log(err); });
		}
	};
}
