import { Http, Response, ResponseContentType } from '@angular/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import 'rxjs/add/operator/timeout';

import { AudioModel } from '../../_models/audio.model';
import { AbstractAudioService } from './audioservice.abstract';

@Injectable()
export class YoutubeAudioService extends AbstractAudioService {
	private discoveredAudios: Map<string, AudioModel> = new Map;

	constructor(_sanitizer: DomSanitizer, _http: Http) {
		super(_sanitizer, _http);
		// retrieve uploaded from local
		let youtubeIDs = localStorage.getItem('youtubeIDs');
		if (youtubeIDs) {
			JSON.parse(youtubeIDs).forEach((uid) => {
				this.getAudio(uid);
			});
		}
	};

	getYoutube (youtubeId: string, onSuccess?: (() => void), onFail?: (() => void)) {
		if (this.hasAudioModel(youtubeId)) {
			return;
		}
		this._http.post('/api/youtube', { "id": youtubeId }, 
		{ "responseType": ResponseContentType.ArrayBuffer })
		.subscribe((data: Response) => {
			this.metadata(youtubeId)
			.subscribe((meta) => {
				let audio = new Blob([data.arrayBuffer()], { type: "application/octet-stream" });
				this.setAudioForm(youtubeId, meta.title, audio);
				if (onSuccess) {
					// save res.id to local
					let youtubeIDs = localStorage.getItem('youtubeIDs');
					let uids = [];
					if (youtubeIDs) {
						uids = JSON.parse(youtubeIDs);
					}
					uids.push(youtubeId);
					localStorage.setItem('youtubeIDs', JSON.stringify(uids));

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

	protected getAudioMap(): Map<string, AudioModel> {
		return this.discoveredAudios;
	}
}
