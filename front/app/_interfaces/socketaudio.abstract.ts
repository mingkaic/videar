import { EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as io from 'socket.io-client';

import { AudioModel } from '../_models/audio.model';
import { IAudioService } from './audioservice.interface';

export abstract class AbstractSocketAudio implements IAudioService {
	protected socket: io.Socket = io();
	
	private audios: Map<string, AudioModel> = new Map;
	private audioChange = new EventEmitter<string>();
	
	constructor(private _sanitizer: DomSanitizer) {}
	
	getAudioChangeEmitter(): EventEmitter<string> {
		return this.audioChange;
	};

	getAudioModel(key: string): AudioModel {
		return this.audios.get(key);
	};
	
	getAllKeys(): string[] {
		return Array.from(this.audios.keys());
	};
	
	hasAudioModel(key: string): boolean {
		return this.audios.has(key);
	};
	
	protected setName(id: string, name: string) {
		let soundInfo;
		if (this.audios.has(id)) {
			soundInfo = this.audios.get(id);
			soundInfo.name = name;
		}
		else {
			soundInfo = new AudioModel(id, name, null);
		}
		this.audios.set(id, soundInfo);
		this.audioChange.emit(id);
	};
	
	protected setAudioData(id: string, soundBlob: Blob) {
		let safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(
			URL.createObjectURL(soundBlob));
		
		let soundInfo;
		if (this.audios.has(id)) {
			soundInfo = this.audios.get(id);
			soundInfo.ref = safeURL;
		}
		else {
			soundInfo = new AudioModel(id, id, safeURL);
		}
		this.audios.set(id, soundInfo);
		this.audioChange.emit(id);
	};
	
	protected setAudioForm(id: string, name: string, soundBlob: Blob) {
		let safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(
			URL.createObjectURL(soundBlob));
		
		let soundInfo;
		if (this.audios.has(id)) {
			soundInfo = this.audios.get(id);
			soundInfo.name = name;
			soundInfo.ref = safeURL;
		}
		else {
			soundInfo = new AudioModel(id, name, safeURL);
		}
		this.audios.set(id, soundInfo);
		this.audioChange.emit(id);
	};
}
