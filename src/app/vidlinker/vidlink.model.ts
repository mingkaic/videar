import * as io from 'socket.io-client';
import * as ss from 'socket.io-stream';

enum linkStatus {
	unprocessed = 0,
	processing,
	processed,
	rejected
};

const linkString: string[] = ["unprocessed", "processing", "processed", "rejected"];
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
		this.status = linkStatus.processing;
		return Promise.resolve(this.link)
		.then((link) => {
			if (utubeReg.test(link)) {
				let vidId = utubeReg.exec(link)[1];
				this.socket.emit('client-audio-request', vidId);
				ss(this.socket).on('audio-stream', (stream, data) => {
					if (data.id === vidId) {
						let sound_data = [];
						stream.on('data', (chunk) => {
							sound_data.push(chunk);
						});
						stream.on('end', () => {
							console.log(new Blob(sound_data));
							this.status = linkStatus.processed;
						});
					}
				});
				this.socket.on('invalid-ytid', (id) => {
					if (id === vidId) {
						this.status = linkStatus.rejected;
					}
				});
			}
			else {
				this.status = linkStatus.rejected;
			}
		})
		.catch((err) => {
			console.log(err);
			this.status = linkStatus.rejected;
		});
	};
};