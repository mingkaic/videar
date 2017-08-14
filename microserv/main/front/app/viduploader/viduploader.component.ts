import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AudioHandleService } from '../services/audio.service';

class FileInfo {
	processing: boolean = false;

	constructor(public file: File) {};

	getStatus() {
		return this.processing ? "processing" : "unprocessed";
	}
}

@Component({
	selector: 'app-viduploader',
	templateUrl: './viduploader.component.html',
	styleUrls: ['./viduploader.component.css']
})
export class VidUploadComponent implements OnInit {
	private files: FileInfo[] = [];

	constructor(private _audioService: AudioHandleService) {};

	ngOnInit() {};

	trackByIndex(index: number, obj: any): any {
		return index;
	};

	onFilesChange(fileList : Array<File>) {
		fileList.forEach((file: File) => {
			this.files.push(new FileInfo(file));
		});
	};

	onFileInvalids(fileList : Array<File>){
		console.log("bad file change");
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
};
