import { Http } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Socket } from 'socket.io-client';
import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

@Injectable()
export class AudioHandleService {
	sounds: Map<string, string>;
	clientSocket: Socket;

	potentialAudio: EventEmitter<string> = new EventEmitter();
	newAudio: EventEmitter<[string, SafeResourceUrl]> = new EventEmitter();
	
	constructor(private _sanitizer: DomSanitizer, private _http: Http)
	{
		this.sounds = new Map<string, string>();
		this.clientSocket = io();

		this._http.get('/api/vidinfos').subscribe((data) => {
			console.log('got audio ids: '+data.json());
			data.json().forEach((vidId) => {
				console.log('requesting audio for '+vidId);
				this.requestAudio(vidId);
			});
		});

		console.log(this.clientSocket);

		// socket listeners
		this.clientSocket.on('new-audio', (vidId: string) => {
			console.log('received new-audio broadcast for '+vidId);
			// todo: implement checking before requesting audio
			// audio streaming is expensive
			this.requestAudio(vidId);
		});
		ss(this.clientSocket).on('audio-stream', 
		(stream, vidId: string) => {
			console.log('streaming for video '+vidId);
			let soundData = [];
			stream.on('data', (chunk) => {
				soundData.push(chunk);
			});
			stream.on('end', () => {
				this.setAudioData(vidId, soundData);
			});
		});
	};

	sendAudio(file: File, onSuccess?: (() => void)) {
		console.log(file);
		// let reader = new FileReader();
		// // send to server
		// let socket: Socket = io();
		// ss(socket).emit('post-audio-client', soundStream);
	};

	requestAudio(vidId: string) {
		if (this.sounds.has(vidId)) return;
		this._http.post('/api/req_audio', { "socketId": this.clientSocket.id, "vidId": vidId })
		.subscribe((data) => {
			if (data.json()) {
				this.potentialAudio.emit(vidId);
			}
			else {
				console.log("notified of new id, but can't find video of id " + vidId);
			}
		});
	}

	setYTId(vidId: string, onSuccess?: (() => void), onFail?: (() => void)) {
		if (this.sounds.has(vidId)) return;
		console.log('verifying id existence');
		this._http.put('/api/verify_id', { "vidId": vidId })
		.subscribe((data) => {
			let idInfo = data.json();
			if (idInfo.exists) {
				console.log('id '+vidId+' definitely exists');
				if (idInfo.onDb) {
					// id is old, but we haven't received audio yet, so request it
					this.requestAudio(vidId);
				}
				else {
					// todo: consider concurrency issue: A verifies link while B uploads link, both A and B verifies link			
				}
				if (onSuccess) {
					this.potentialAudio.emit(vidId);
					onSuccess();
				}
			}
			else {
				console.log('id '+vidId+" doesn't exists");
				onFail();
			}
		});
	};

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
		this.newAudio.emit([id, this.getAudioUrl(id)]);
	};
}
