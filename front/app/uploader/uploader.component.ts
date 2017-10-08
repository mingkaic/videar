import { Component, OnInit } from '@angular/core';
import { Uploader } from 'angular2-http-file-upload';

import { UploadAudioService } from '../_services/audioservices';

class FileInfo {
	processing: boolean = false;

	constructor(public file: File) {};

	getStatus() {
		return this.processing ? "processing" : "unprocessed";
	};
}

@Component({
	selector: 'app-viduploader',
	templateUrl: './uploader.component.html',
	styleUrls: ['./uploader.component.css'],
	providers: [ UploadAudioService, Uploader ]
})
export class UploadComponent implements OnInit {
	private files: FileInfo[] = [];

	constructor(private _audioService: UploadAudioService) {};

	ngOnInit() {};

	trackByIndex(index: number, obj: any): any {
		return index;
	};

	onFilesChange(fileList : Array<File>) {
		fileList.forEach((file: File) => {
			this.files.push(new FileInfo(file));
		});
	};

	onFileInvalids(fileList : Array<File>) {
		if (fileList.length > 0) {
			// warn of bad files...
			console.log("bad file change");
		}
	};

	removeFile(index: number) {
		this.files.splice(index, 1);
	};

	uploadFile(index: number) {
		// todo: add users
		// todo: limit user's number of uploads
		let file = this.files[index];
		file.processing = true;
		this._audioService.sendAudio(file.file,
		() => {
			this.removeFile(index);
		});
	};
}
