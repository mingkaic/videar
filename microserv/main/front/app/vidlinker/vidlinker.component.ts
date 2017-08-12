import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AudioHandleService } from '../services/audio.service';

enum linkStatus {
	unprocessed = 0,
	processing,
	rejected
};

const utubeReg: RegExp = /^.*youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?.*/;

@Component({
	selector: 'vidlinker-component',
	templateUrl: './vidlinker.component.html',
	styleUrls: ['./vidlinker.component.css']
})
export class VidLinkerComponent implements OnInit {
	@Input() 
	link: string = "";

	@Output()
	uploaded: EventEmitter<string> = new EventEmitter();
	
	status: linkStatus = linkStatus.unprocessed;
	linkString: string[] = ["unprocessed", "processing", "rejected"];

	constructor(private _audioService: AudioHandleService) {};

	ngOnInit() {};

	processLink() {
		if (this.status === linkStatus.processing) return;
		this.status = linkStatus.processing;
		if (utubeReg.test(this.link)) {
			let vidId = utubeReg.exec(this.link)[1];
			this._audioService.setYTId(vidId, 
			() => {
				this.uploaded.emit('complete');
			}, 
			() => {
                this.status = linkStatus.rejected;
            });
		}
		else {
			this.status = linkStatus.rejected;
		}
	};

	removeLink() {
		this.uploaded.emit('complete');
	}

	clear() {
		this.link = "";
		this.status = linkStatus.unprocessed;
	};
};
