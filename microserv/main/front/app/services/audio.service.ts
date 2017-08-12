import { Http } from '@angular/http'
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Socket } from 'socket.io-client';
import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

function socket_on_get_audio(socket: Socket, cb?: (() => void)) {
	ss(socket).on('audio-stream', 
	(stream, vidId: string) => {
		let soundData = [];
		stream.on('data', (chunk) => {
			soundData.push(chunk);
		});
		stream.on('end', () => {
			this.setAudioData(vidId, soundData);

			if (cb) {
				cb();
			}
		});
	});
}

@Injectable()
export class AudioHandleService {
	private soundAdder: ((_: string) => void);
	private sounds: Map<string, string>;
	private clientSocket: Socket;
	
	constructor(private _sanitizer: DomSanitizer, private _http: Http)
	{
		this.sounds = new Map<string, string>();
		this.clientSocket = io();
		this.clientSocket.on('new-audio', (vidId: string) => {
			// todo: implement checking before requesting audio
			// audio streaming is expensive
			this.clientSocket.emit('client-get-audio');
		});
		socket_on_get_audio(this.clientSocket);
		if (this._http) {
			this._http.get('/api/vidinfos').subscribe((data) => {
				data.json().forEach((vidId) => {
					this.setYTId(vidId);
				});
			});
		}
	};

	sendAudio(file: File, onSuccess?: (() => void)) {
		let reader = new FileReader();
		// send to server
		let socket: Socket = io();
		// ss(socket).emit('client-send-audio', soundStream);
	};

	setYTId(vidId: string, onSuccess?: (() => void), onFail?: (() => void)) {
		if (this.sounds.has(vidId)) return;
		// temporary socket for this one id
		let socket: Socket = io();
		socket.emit('client-verify-id', vidId);
		socket.on('old-ytid', () => {
			// id is old, but we haven't received audio yet, so request it
			// todo: consider concurrency issue: A verifies link while B uploads link, both A and B verifies link
			socket.emit("client-get-audio", vidId);
			socket_on_get_audio(socket, onSuccess);
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

	getAudioUrl(id: string) {
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
