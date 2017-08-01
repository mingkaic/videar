import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

enum linkStatus {
	unprocessed = 0,
	processing,
	rejected
};

const linkString: string[] = ["unprocessed", "processing", "rejected"];
const utubeReg: RegExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

export class VidLinkModel {
	link: string = "";
	private status: linkStatus = linkStatus.unprocessed;
	private socket: io.Socket;

	constructor() {
		this.socket = io();
	};

	getStatus() : string {
		return linkString[this.status];
	};

	processLink() {
		if (this.status === linkStatus.processing) return;
		this.status = linkStatus.processing;
		return Promise.resolve(this.link)
		.then((link) => {
			// perform client side link test
			if (utubeReg.test(link)) {
				let vidId = utubeReg.exec(link)[1];
				this.socket.emit('client-get-audio', vidId);
				// discovered invalid id on server side
				this.socket.on('invalid-ytid', (id) => {
					this.status = linkStatus.rejected;
				});
				return this.socket;
			}
			this.status = linkStatus.rejected;
			return null;
		})
		.catch((err) => {
			console.log(err);
			this.status = linkStatus.rejected;
		});
	};

	clear() {
		this.link = "";
		this.status = linkStatus.unprocessed;
	}
};
