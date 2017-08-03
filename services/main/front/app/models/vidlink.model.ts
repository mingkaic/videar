import { AudioHandleService } from '../services/audio.service';

export enum linkStatus {
	unprocessed = 0,
	processing,
	rejected
};

const linkString: string[] = ["unprocessed", "processing", "rejected"];
const utubeReg: RegExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

export class VidLinkModel {
	link: string = "";
	private status: linkStatus = linkStatus.unprocessed;

	constructor(private _audioService: AudioHandleService) {};

	getStatus() : string {
		return linkString[this.status];
	};

	getId() : string {
		if (utubeReg.test(this.link)) {
			return utubeReg.exec(this.link)[1];
		}
		return null;
	};

	processLink(onSuccess: (() => void)) {
		if (this.status === linkStatus.processing) return;
		this.status = linkStatus.processing;
		let vidId = this.getId();
		if (vidId) {
			this._audioService.getAudio(vidId, onSuccess, 
			() => {
                this.status = linkStatus.rejected;
            });
		}
		else {
			this.status = linkStatus.rejected;
		}
	};

	clear() {
		this.link = "";
		this.status = linkStatus.unprocessed;
	};
};
