import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AudioHandleService } from '../services/audio.service';

@Component({
	selector: 'app-viduploader',
	templateUrl: './viduploader.component.html',
	styleUrls: ['./viduploader.component.css']
})
export class VidUploadComponent implements OnInit {
	private files: any = [];
	private invalidFiles : any = [];

	constructor(private _audioService: AudioHandleService) {};

	ngOnInit() {};

	trackByIndex(index: number, obj: any): any {
		return index;
	};

	onFilesChange(fileList : Array<File>) {
    	this.files = fileList;
	};

	onFileInvalids(fileList : Array<File>){
		this.invalidFiles = fileList;
	};

	removeFile(index: number) {
		if (index > 0 || this.files.length > 1) {
			this.files.splice(index, 1);
		}
	};

	uploadFile(index: number) {
		// todo: add users
		// todo: limit user's number of uploads
		this._audioService.sendAudio(this.files[index],
		() => {
			this.removeFile(index);
		});
	};
};
