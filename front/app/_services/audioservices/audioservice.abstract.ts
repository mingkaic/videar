import { Http, Response, ResponseContentType } from '@angular/http';
import { EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AudioModel } from '../../_models/audio.model';
import { IAudioService } from './audioservice.interface';

export abstract class AbstractAudioService implements IAudioService {
	private audioChange = new EventEmitter<string>();
	
	constructor(private _sanitizer: DomSanitizer, protected _http: Http) {}
	
	getAudioChangeEmitter(): EventEmitter<string> {
		return this.audioChange;
	};

	getAudioModel(key: string): AudioModel {
		return this.getAudioMap().get(key);
	};
	
	getAllKeys(): string[] {
		return Array.from(this.getAudioMap().keys());
	};
	
	hasAudioModel(key: string): boolean {
		return this.getAudioMap().has(key);
	};
	
	addAudio(aud: AudioModel) {
		let id = aud._id;
		this.getAudioMap().set(id, aud);
		this.audioChange.emit(id);
	}

	removeAudio(id: string) {
		this.getAudioMap().delete(id);
		this.audioChange.emit(id);
	}
	
	protected abstract getAudioMap(): Map<string, AudioModel>;
	
	protected metadata (id: string) {
		return this._http.get('/api/audio_meta/' + id).map((data: Response) => data.json());
	};

	protected getAudio (id: string, title?: string) {
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
	
	protected setAudioForm(id: string, name: string, soundBlob: Blob) {
		let safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(
			URL.createObjectURL(soundBlob));

		let soundInfo;
		let audio = this.getAudioMap();
		if (audio.has(id)) {
			soundInfo = audio.get(id);
			soundInfo.name = name;
			soundInfo.ref = safeURL;
		}
		else {
			soundInfo = new AudioModel(id, name, safeURL);
		}
		this.addAudio(soundInfo);
	};
}
