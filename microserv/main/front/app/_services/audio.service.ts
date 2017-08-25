import { Http } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

export class ViewableAudio {
	selected: boolean = true;

	constructor(public name: string, public ref: SafeResourceUrl) {}

	getSelectionLabel(): String {
		return this.selected ? "Deselect" : "Select";
	}

	toggleSelect() {
		this.selected = !this.selected;
	}
}

@Injectable()
export class AudioHandleService {
	sounds: Map<string, ViewableAudio>;
	clientSocket: io.Socket;
	
	constructor(private _sanitizer: DomSanitizer, private _http: Http)
	{
		this.sounds = new Map<string, ViewableAudio>();
		this.clientSocket = io();

		this._http.get('/api/vidinfos').subscribe((data) => {
			data.json().forEach((vidInfo) => {
				var id = vidInfo.vidId;
				this.requestAudio(id);
				this.setPotential(id, vidInfo.source);
			});
		});

		// socket listeners
		this.clientSocket.on('new-audio', (vidId: string) => {
			console.log('new audio notified '+vidId);
			// todo: implement selective audio loading before requesting audio (not every audio needs to be viewed)
			// audio streaming is expensive
			this.requestAudio(vidId);
		});
		ss(this.clientSocket).on('audio-stream', 
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

	sendAudio(file: File, onSuccess?: (() => void)) {
		var outStream = ss.createStream();
		ss(this.clientSocket).emit('post-audio-client', outStream, file.name);
		ss.createBlobReadStream(file).pipe(outStream);
		outStream.on('finish', () => {
			onSuccess();
		})
	};

	requestAudio(vidId: string) {
		if (this.sounds.has(vidId) && null != this.sounds.get(vidId).ref) return;
		console.log('requesting stream for '+vidId);
		this._http.post('/api/req_audio', { "socketId": this.clientSocket.id, "vidId": vidId })
		.subscribe((data) => {
			var source = data.json().source;
			if (source) {
				this.setPotential(vidId, source);
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
			console.log(idInfo);
			if (idInfo.source) {
				console.log('id '+vidId+' definitely exists');
				if (idInfo.onDb) {
					// id is old, but we haven't received audio yet, so request it
					this.requestAudio(vidId);
				}
				else {
					// todo: consider concurrency issue: A verifies link while B uploads link, both A and B verifies link			
				}
				if (onSuccess) {
					this.setPotential(vidId, idInfo.source);
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

	getSelectedIds(): string[] {
		let viewables = Array.from(this.sounds.keys());
		return viewables.filter((vidId: string) => this.sounds.get(vidId).selected);
	}

	private setPotential(id: string, source: string) {
		if (this.sounds.has(id)) return;

		if (source === ".<youtube>") {
			let callsign = "http://www.youtube.com/watch?v=" + id;
			this.sounds.set(id, new ViewableAudio(callsign, null));
		}
		else {
			this.sounds.set(id, new ViewableAudio(source, null));
		}
	}

	private setAudioData(id: string, soundData) {
		if (false == this.sounds.has(id)) return;

		let soundBlob = new Blob(soundData);
		let safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(
			URL.createObjectURL(soundBlob));
		
		let soundInfo = this.sounds.get(id);
		soundInfo.ref = safeURL;
		this.sounds.delete(id);
		setTimeout(() => this.sounds.set(id, soundInfo), 0);
	};
}
