import { Http } from '@angular/http'
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Socket } from 'socket.io-client';
import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

@Injectable()
export class AudioHandleService {
	private soundAdder: ((_: string) => void);
	private sounds: Map<string, string>;
	
	constructor(private _sanitizer: DomSanitizer, private _http: Http)
	{
		this.sounds = new Map<string, string>();
		this._http.get('/api/vidinfos').subscribe((data) => {
			data.json().forEach((vidId) => {
				this.getAudio(vidId);
			});
		});
	};

	getAudio(vidId: string, onSuccess?: (() => void), onFail?: (() => void)) {
		if (this.sounds.has(vidId)) return;
		let socket: Socket = io();
		socket.emit('client-get-audio', vidId);
		ss(socket).on('audio-stream', 
		(stream, vidId: string) => {
			let soundData = [];
			stream.on('data', (chunk) => {
				soundData.push(chunk);
			});
			stream.on('end', () => {
				this.setAudioData(vidId, soundData);
				
				if (onSuccess) {
					onSuccess();
				}
			});
		});
		socket.on('invalid-ytid', onFail);
	};

	setAdder(addId: ((_: string) => void)) {
		this.soundAdder = addId;
		this.sounds.forEach((_: string, vidId: string) => {
			addId(vidId);
		});
	}

	hasAudio(vidId: string): boolean {
		return this.sounds.has(vidId);
	};

	getLocalAudioUrl(id: string) {
		if (!this.hasAudio(id)) return null;
		return this._sanitizer.bypassSecurityTrustResourceUrl(this.sounds.get(id));
	};

	private setAudioData(id: string, soundData) {
		if (this.sounds.has(id)) return;
		let soundBlob = new Blob(soundData);
		this.sounds.set(id, URL.createObjectURL(soundBlob));
		if (this.soundAdder) {
			this.soundAdder(id);
		}
	};
}
