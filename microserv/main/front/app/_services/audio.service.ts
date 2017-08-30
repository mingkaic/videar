import { Http } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import * as ss from 'socket.io-stream';

import { AudioModel } from '../_models/audio.model';
import { AbstractSocketAudio } from '../_interfaces/socketaudio.abstract';

@Injectable()
export class AudioHandleService extends AbstractSocketAudio {
	constructor(_sanitizer: DomSanitizer, private _http: Http) {
		super(_sanitizer);

		this._http.get('/api/vidinfos').subscribe((data) => {
			data.json().forEach((vidInfo) => {
				var id = vidInfo.vidId;
				this.requestAudio(id);
				this.setName(id, vidInfo.name);
			});
		});

		// socket listeners
		this.socket.on('new-audio', (vidId: string) => {
			console.log('new audio notified '+vidId);
			// todo: implement selective audio loading before requesting audio (not every audio needs to be viewed)
			// IF logged in load user's audios first

			// audio streaming is expensive
			this.requestAudio(vidId);
		});
		ss(this.socket).on('audio-stream', 
		(stream, vidId: string) => {
			console.log('streaming '+vidId);
			let soundData = [];
			stream.on('data', (chunk) => {
				soundData.push(chunk);
			});
			stream.on('end', () => {
				this.setAudioData(vidId, soundData);
			});
		});
	};
	
	updateAudio(audio: AudioModel) {
		this._http.post('/api/audio_meta', { 'vidId': audio._id, 'name': audio.name })
		.subscribe((data) => {
			console.log(audio._id + " update successful");
		},
		(err) => {
			console.log(err);
		});
	};

	requestSubtitles(vidId: string) {
		return this._http.get('/api/audio_subtitles/' + vidId)
		.map((data) => {
			return data.json();
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
		})
	};

	requestAudio(vidId: string) {
		if (this.hasAudioModel(vidId) && null != this.getAudioModel(vidId).ref) return;
		console.log('requesting stream for '+vidId);
		this._http.post('/api/req_audio', { "socketId": this.socket.id, "vidId": vidId })
		.subscribe((data) => {
			console.log("REQUESTED AUDIO ", data.json());
			var name = data.json().name;
			if (name) {
				this.setName(vidId, name);
			}
			else {
				console.log("notified of new id, but can't find video of id " + vidId);
			}
		});
	};

	setYTId(vidId: string, onSuccess?: (() => void), onFail?: (() => void)) {
		if (this.hasAudioModel(vidId)) return;
		console.log('verifying id existence');
		this._http.put('/api/verify_id', { "vidId": vidId })
		.subscribe((data) => {
			let idInfo = data.json();
			let name = idInfo.name;
			console.log(idInfo);
			if (name) {
				console.log('id '+vidId+' definitely exists');
				if (idInfo.onDb) {
					// id is old, but we haven't received audio yet, so request it
					this.requestAudio(vidId);
				}
				else {
					// todo: consider concurrency issue: A verifies link while B uploads link, both A and B verifies link			
				}
				if (onSuccess) {
					this.setName(vidId, name);
					onSuccess();
				}
			}
			else {
				console.log('id '+vidId+" doesn't exists");
				onFail();
			}
		});
	};
}
