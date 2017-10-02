import { Http, Response, ResponseContentType } from '@angular/http'
import { Injectable, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';
import { UploadItem, Uploader } from 'angular2-http-file-upload';

import 'rxjs/add/operator/timeout';

import { AudioModel } from '../../_models/audio.model';
import { AbstractAudioService } from './audioservice.abstract';

class FileUploadItem extends UploadItem {
	constructor(file: any) {
		super();
		this.url = '/api/upload_audio';
		this.file = file;
	}
}

@Injectable()
export class UploadAudioService extends AbstractAudioService {
	private uploadedAudios: Map<string, AudioModel> = new Map;

	constructor(sanitizer: DomSanitizer, http: Http, public _uploaderService: Uploader) {
		super(sanitizer, http);
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
		let uploadItem = new FileUploadItem(file);

		this._uploaderService.onSuccessUpload = (item, res, status, headers) => {
			this.setAudioForm(res.id, file.name, file);
			onSuccess();
		};
		this._uploaderService.onErrorUpload = (item, res, status, headers) => {
			// error callback
		};
		this._uploaderService.onProgressUpload = (item, percentComplete) => {
			// progress callback
		};
		this._uploaderService.upload(uploadItem);
	};

	protected getAudioMap(): Map<string, AudioModel> {
		return this.uploadedAudios;
	}
}
